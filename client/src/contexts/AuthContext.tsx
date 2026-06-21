import React, { createContext, useContext, useState, useEffect } from "react";
import { apiFetch, ApiError } from "@/lib/api";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  schoolId: string | null;
  currentTeamId: string | null;
}

export interface School {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  logo: string | null;
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  isPersonal: boolean;
  role: string;
}

export interface AuthContextType {
  user: User | null;
  school: School | null;
  teams: Team[];
  currentTeam: any | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, companyName?: string) => Promise<void>;
  logout: () => Promise<void>;
  switchSchool: (teamId: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [school, setSchool] = useState<School | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeam, setCurrentTeam] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentUser = async () => {
    try {
      setIsLoading(true);
      const data = await apiFetch("/api/auth/me");
      setUser(data.user);
      setSchool(data.school);
      setTeams(data.teams || []);
      setCurrentTeam(data.currentTeam);
      setError(null);
    } catch (err: any) {
      setUser(null);
      setSchool(null);
      setTeams([]);
      setCurrentTeam(null);
      // Don't set error on initial mount if not logged in (401 is expected)
      if (err instanceof ApiError && err.status !== 401) {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      await fetchCurrentUser();
    } catch (err: any) {
      setError(err.message || "Login failed");
      throw err;
    }
  };

  const register = async (name: string, email: string, password: string, companyName?: string) => {
    setError(null);
    try {
      await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
          company_name: companyName,
        }),
      });
      await fetchCurrentUser();
    } catch (err: any) {
      setError(err.message || "Registration failed");
      throw err;
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch (err: any) {
      // Even if network fails, clear local credentials
    } finally {
      setUser(null);
      setSchool(null);
      setTeams([]);
      setCurrentTeam(null);
    }
  };

  const switchSchool = async (teamId: string) => {
    setError(null);
    try {
      await apiFetch(`/api/teams/${teamId}/switch`, {
        method: "POST",
      });
      await fetchCurrentUser();
    } catch (err: any) {
      setError(err.message || "Failed to switch school context");
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        school,
        teams,
        currentTeam,
        isLoading,
        error,
        login,
        register,
        logout,
        switchSchool,
        refreshUser: fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
