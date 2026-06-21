import { Response } from 'express';
import crypto from 'crypto';
import { prisma } from '../db';
import { AuthRequest } from '../middleware/auth';
import { TeamRole } from '@prisma/client';

export async function createTeam(req: AuthRequest, res: Response) {
  try {
    const { name } = req.body;
    const userId = req.user?.id;
    const schoolId = req.user?.schoolId;

    if (!userId) return res.status(401).json({ error: 'Unauthorized.' });
    if (!name) return res.status(400).json({ error: 'Team name is required.' });

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + crypto.randomBytes(4).toString('hex');

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Team
      const team = await tx.team.create({
        data: {
          name,
          slug,
          isPersonal: false,
        },
      });

      // 2. Add creator as Owner
      await tx.teamMember.create({
        data: {
          teamId: team.id,
          userId,
          role: TeamRole.owner,
        },
      });

      // 3. Switch current team
      await tx.user.update({
        where: { id: userId },
        data: { currentTeamId: team.id },
      });

      return team;
    });

    return res.status(201).json({
      message: 'Team created successfully.',
      team: result,
    });
  } catch (err) {
    console.error('Create team error:', err);
    return res.status(500).json({ error: 'Internal server error creating team.' });
  }
}

export async function updateTeam(req: AuthRequest, res: Response) {
  try {
    const { teamId } = req.params;
    const { name } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ error: 'Unauthorized.' });
    if (!name) return res.status(400).json({ error: 'Team name is required.' });

    // Validate if user has update permission (Owner/Admin)
    const membership = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId } },
    });

    if (!membership || (membership.role !== 'owner' && membership.role !== 'admin' && membership.role !== 'principal')) {
      return res.status(403).json({ error: 'You do not have permission to update this team.' });
    }

    const updatedTeam = await prisma.team.update({
      where: { id: teamId },
      data: { name },
    });

    return res.json({
      message: 'Team updated successfully.',
      team: updatedTeam,
    });
  } catch (err) {
    console.error('Update team error:', err);
    return res.status(500).json({ error: 'Internal server error updating team.' });
  }
}

export async function deleteTeam(req: AuthRequest, res: Response) {
  try {
    const { teamId } = req.params;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ error: 'Unauthorized.' });

    // Validate ownership
    const membership = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId } },
    });

    if (!membership || membership.role !== 'owner') {
      return res.status(403).json({ error: 'Only the team owner can delete the team.' });
    }

    // Delete team inside transaction
    await prisma.$transaction(async (tx) => {
      // Find team members
      const members = await tx.teamMember.findMany({ where: { teamId } });
      const userIds = members.map((m) => m.userId);

      // Reset currentTeamId for users whose current team is this one
      await tx.user.updateMany({
        where: { currentTeamId: teamId, id: { in: userIds } },
        data: { currentTeamId: null },
      });

      // Delete memberships & invitation
      await tx.teamMember.deleteMany({ where: { teamId } });
      await tx.teamInvitation.deleteMany({ where: { teamId } });
      await tx.team.delete({ where: { id: teamId } });
    });

    return res.json({ message: 'Team deleted successfully.' });
  } catch (err) {
    console.error('Delete team error:', err);
    return res.status(500).json({ error: 'Internal server error deleting team.' });
  }
}

export async function switchTeam(req: AuthRequest, res: Response) {
  try {
    const { teamId } = req.params;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ error: 'Unauthorized.' });

    // Verify member belongs to team
    const membership = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId } },
    });

    if (!membership) {
      return res.status(403).json({ error: 'You are not a member of this team.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { currentTeamId: teamId },
    });

    return res.json({
      message: 'Switched team successfully.',
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
    console.error('Switch team error:', err);
    return res.status(500).json({ error: 'Internal server error switching team.' });
  }
}

export async function updateMemberRole(req: AuthRequest, res: Response) {
  try {
    const { teamId, memberUserId } = req.params;
    const { role } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ error: 'Unauthorized.' });
    if (!role) return res.status(400).json({ error: 'Role is required.' });

    // Check if current user is owner or admin
    const currentUserMembership = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId } },
    });

    if (!currentUserMembership || (currentUserMembership.role !== 'owner' && currentUserMembership.role !== 'admin' && currentUserMembership.role !== 'principal')) {
      return res.status(403).json({ error: 'Unauthorized permissions to update member role.' });
    }

    // Check target membership exists
    const targetMembership = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId: memberUserId } },
    });

    if (!targetMembership) {
      return res.status(404).json({ error: 'Team member not found.' });
    }

    if (targetMembership.role === 'owner') {
      return res.status(400).json({ error: 'Cannot modify Owner role.' });
    }

    const updatedMembership = await prisma.teamMember.update({
      where: { teamId_userId: { teamId, userId: memberUserId } },
      data: { role: role as TeamRole },
    });

    return res.json({
      message: 'Member role updated successfully.',
      member: updatedMembership,
    });
  } catch (err) {
    console.error('Update member role error:', err);
    return res.status(500).json({ error: 'Internal server error updating member role.' });
  }
}

export async function removeMember(req: AuthRequest, res: Response) {
  try {
    const { teamId, memberUserId } = req.params;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ error: 'Unauthorized.' });

    // Allow user to leave team, or owner/admin to remove user
    const isSelfLeaving = userId === memberUserId;

    const currentUserMembership = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId } },
    });

    if (!currentUserMembership) {
      return res.status(403).json({ error: 'You are not part of this team.' });
    }

    if (!isSelfLeaving && currentUserMembership.role !== 'owner' && currentUserMembership.role !== 'admin' && currentUserMembership.role !== 'principal') {
      return res.status(403).json({ error: 'Unauthorized permissions to remove member.' });
    }

    // Find target member
    const targetMembership = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId: memberUserId } },
    });

    if (!targetMembership) {
      return res.status(404).json({ error: 'Member not found.' });
    }

    if (targetMembership.role === 'owner') {
      return res.status(400).json({ error: 'Owner cannot be removed. Transfer ownership or delete team.' });
    }

    await prisma.$transaction(async (tx) => {
      await tx.teamMember.delete({
        where: { teamId_userId: { teamId, userId: memberUserId } },
      });

      // Reset currentTeamId for removed user
      await tx.user.updateMany({
        where: { id: memberUserId, currentTeamId: teamId },
        data: { currentTeamId: null },
      });
    });

    return res.json({ message: 'Member removed successfully.' });
  } catch (err) {
    console.error('Remove member error:', err);
    return res.status(500).json({ error: 'Internal server error removing member.' });
  }
}

export async function inviteMember(req: AuthRequest, res: Response) {
  try {
    const { teamId } = req.params;
    const { email, role } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ error: 'Unauthorized.' });
    if (!email || !role) {
      return res.status(400).json({ error: 'Email and role are required.' });
    }

    // Validate permissions (Owner/Admin)
    const membership = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId } },
    });

    if (!membership || (membership.role !== 'owner' && membership.role !== 'admin' && membership.role !== 'principal')) {
      return res.status(403).json({ error: 'Unauthorized permissions to invite.' });
    }

    // Check if already a member
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      const isAlreadyMember = await prisma.teamMember.findUnique({
        where: { teamId_userId: { teamId, userId: existingUser.id } },
      });
      if (isAlreadyMember) {
        return res.status(400).json({ error: 'User is already a member of this team.' });
      }
    }

    // Generate random code for invitation
    const code = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    const invitation = await prisma.teamInvitation.create({
      data: {
        teamId,
        email,
        role: role as TeamRole,
        code,
        invitedBy: userId,
        expiresAt,
      },
    });

    return res.status(201).json({
      message: 'Invitation sent successfully.',
      invitation: {
        code: invitation.code,
        email: invitation.email,
        role: invitation.role,
        createdAt: invitation.createdAt,
      },
    });
  } catch (err) {
    console.error('Invite member error:', err);
    return res.status(500).json({ error: 'Internal server error inviting member.' });
  }
}

export async function cancelInvitation(req: AuthRequest, res: Response) {
  try {
    const { teamId, inviteCode } = req.params;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ error: 'Unauthorized.' });

    // Validate permissions
    const membership = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId } },
    });

    if (!membership || (membership.role !== 'owner' && membership.role !== 'admin' && membership.role !== 'principal')) {
      return res.status(403).json({ error: 'Unauthorized permissions to cancel invitations.' });
    }

    await prisma.teamInvitation.delete({
      where: { code: inviteCode },
    });

    return res.json({ message: 'Invitation cancelled successfully.' });
  } catch (err) {
    console.error('Cancel invitation error:', err);
    return res.status(500).json({ error: 'Internal server error cancelling invitation.' });
  }
}

export async function acceptInvitation(req: AuthRequest, res: Response) {
  try {
    const { inviteCode } = req.params;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ error: 'Unauthorized.' });

    const invitation = await prisma.teamInvitation.findUnique({
      where: { code: inviteCode },
      include: { team: true },
    });

    if (!invitation || invitation.acceptedAt) {
      return res.status(400).json({ error: 'Invalid or already accepted invitation.' });
    }

    if (invitation.expiresAt && invitation.expiresAt < new Date()) {
      return res.status(400).json({ error: 'Invitation has expired.' });
    }

    // Accept invitation inside transaction
    await prisma.$transaction([
      // Add member
      prisma.teamMember.create({
        data: {
          teamId: invitation.teamId,
          userId,
          role: invitation.role,
        },
      }),
      // Mark accepted
      prisma.teamInvitation.update({
        where: { id: invitation.id },
        data: { acceptedAt: new Date() },
      }),
      // Switch user's active team to this team
      prisma.user.update({
        where: { id: userId },
        data: { currentTeamId: invitation.teamId },
      }),
    ]);

    return res.json({
      message: 'Invitation accepted. Joined team successfully.',
      team: {
        id: invitation.team.id,
        name: invitation.team.name,
        slug: invitation.team.slug,
      },
    });
  } catch (err) {
    console.error('Accept invitation error:', err);
    return res.status(500).json({ error: 'Internal server error accepting invitation.' });
  }
}

export async function listMembers(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const currentTeamId = req.user?.currentTeamId;

    if (!userId || !currentTeamId) {
      return res.status(400).json({ error: 'Active team required.' });
    }

    const team = await prisma.team.findUnique({
      where: { id: currentTeamId },
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
        invitations: {
          where: { acceptedAt: null },
        },
      },
    });

    if (!team) {
      return res.status(404).json({ error: 'Team not found.' });
    }

    const userRole = team.members.find((m) => m.userId === userId)?.role || 'member';

    const permissions = {
      canUpdateTeam: ['owner', 'admin', 'principal'].includes(userRole),
      canDeleteTeam: userRole === 'owner',
      canAddMember: ['owner', 'admin', 'principal'].includes(userRole),
      canUpdateMember: ['owner', 'admin', 'principal'].includes(userRole),
      canRemoveMember: ['owner', 'admin', 'principal'].includes(userRole),
    };

    const availableRoles = [
      { value: 'admin', label: 'Admin' },
      { value: 'principal', label: 'Principal' },
      { value: 'hod', label: 'Head of Department' },
      { value: 'admission', label: 'Admission' },
      { value: 'accounts', label: 'Accounts' },
      { value: 'faculty', label: 'Faculty' },
      { value: 'member', label: 'Member' },
    ];

    return res.json({
      team: {
        id: team.id,
        name: team.name,
        slug: team.slug,
        isPersonal: team.isPersonal,
      },
      members: team.members.map((m) => ({
        id: m.user.id,
        name: m.user.name,
        email: m.user.email,
        role: m.role,
        role_label: m.role.charAt(0).toUpperCase() + m.role.slice(1),
      })),
      invitations: team.invitations.map((i) => ({
        code: i.code,
        email: i.email,
        role: i.role,
        role_label: i.role.charAt(0).toUpperCase() + i.role.slice(1),
        created_at: i.createdAt.toISOString(),
      })),
      permissions,
      availableRoles,
    });
  } catch (err) {
    console.error('List members error:', err);
    return res.status(500).json({ error: 'Internal server error listing members.' });
  }
}

