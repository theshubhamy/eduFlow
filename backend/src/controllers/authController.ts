import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../db";
import { Prisma } from "@prisma/client";
import { AuthRequest } from "../middleware/auth";

const JWT_SECRET =
  process.env.JWT_SECRET || "eduflow-secret-key-123!super-secure-change-it";

// Helper to sign JWT
function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

// Helper to set cookie
function setTokenCookie(res: Response, token: string) {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password, company_name } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email, and password are required." });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new School, Team, User, and TeamMember inside a transaction
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Create School
      const school = await tx.school.create({
        data: {
          name: `${name}'s School`,
        },
      });

      // 2. Create Team
      const teamSlug = email.split("@")[0] + "-team";
      const team = await tx.team.create({
        data: {
          name: company_name || `${name}'s Team`,
          slug: teamSlug,
          isPersonal: true,
        },
      });

      // 3. Create User
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "admin", // Owner registers as admin / principal
          schoolId: school.id,
          currentTeamId: team.id,
        },
      });

      // 4. Create Team Member (Owner role)
      await tx.teamMember.create({
        data: {
          teamId: team.id,
          userId: user.id,
          role: "owner",
        },
      });

      return { user, team, school };
    });

    const token = generateToken(result.user.id);
    setTokenCookie(res, token);

    return res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
        schoolId: result.user.schoolId,
        currentTeamId: result.user.currentTeamId,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error during registration." });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = generateToken(user.id);
    setTokenCookie(res, token);

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        schoolId: user.schoolId,
        currentTeamId: user.currentTeamId,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error during login." });
  }
}

export async function logout(req: Request, res: Response) {
  res.clearCookie("token");
  return res.json({ message: "Logged out successfully." });
}

export async function getMe(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated." });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        school: true,
        currentTeam: {
          include: {
            members: {
              include: {
                user: {
                  select: { id: true, name: true, email: true },
                },
              },
            },
            invitations: {
              where: { acceptedAt: null },
            },
          },
        },
        memberships: {
          include: {
            team: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Get all teams the user belongs to
    const teams = user.memberships.map((m: any) => ({
      id: m.team.id,
      name: m.team.name,
      slug: m.team.slug,
      isPersonal: m.team.isPersonal,
      role: m.role,
    }));

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        schoolId: user.schoolId,
        currentTeamId: user.currentTeamId,
      },
      currentTeam: user.currentTeam
        ? {
            id: user.currentTeam.id,
            name: user.currentTeam.name,
            slug: user.currentTeam.slug,
            isPersonal: user.currentTeam.isPersonal,
            owner:
              user.currentTeam.members.find((m: any) => m.role === "owner")?.user ||
              null,
            members: user.currentTeam.members.map((m: any) => ({
              id: m.user.id,
              name: m.user.name,
              email: m.user.email,
              role: m.role,
            })),
            invitations: user.currentTeam.invitations.map((i: any) => ({
              code: i.code,
              email: i.email,
              role: i.role,
              createdAt: i.createdAt,
            })),
          }
        : null,
      teams,
      school: user.school,
    });
  } catch (err) {
    console.error("getMe error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error fetching user." });
  }
}

export async function updateProfile(req: AuthRequest, res: Response) {
  try {
    const { name, email } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ error: "Unauthorized." });

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required." });
    }

    // Check email uniqueness if changed
    if (email !== req.user?.email) {
      const emailExists = await prisma.user.findUnique({ where: { email } });
      if (emailExists) {
        return res.status(400).json({ error: "Email already in use." });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email },
    });

    return res.json({
      message: "Profile updated successfully.",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        schoolId: updatedUser.schoolId,
        currentTeamId: updatedUser.currentTeamId,
      },
    });
  } catch (err) {
    console.error("Update profile error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error updating profile." });
  }
}

export async function deleteAccount(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized." });

    // Clean up inside a transaction
    await prisma.$transaction([
      prisma.teamMember.deleteMany({ where: { userId } }),
      prisma.user.delete({ where: { id: userId } }),
    ]);

    res.clearCookie("token");
    return res.json({ message: "Account deleted successfully." });
  } catch (err) {
    console.error("Delete account error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error deleting account." });
  }
}

export async function updatePassword(req: AuthRequest, res: Response) {
  try {
    const { current_password, password } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ error: "Unauthorized." });
    if (!current_password || !password) {
      return res
        .status(400)
        .json({ error: "Current password and new password are required." });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found." });

    const isMatch = await bcrypt.compare(current_password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect current password." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return res.json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("Update password error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error updating password." });
  }
}
