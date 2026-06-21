import React, { useState } from "react";
import {
  useMembers,
  useInviteMember,
  useCancelInvitation,
  useRemoveMember,
  useUpdateMemberRole,
  useCreateTeam,
} from "@/hooks/queries/useTeam";
import { useCurrentUser } from "@/hooks/queries/useAuth";
import {
  Loader2,
  X,
  Shield,
  Mail,
  Trash2,
  Check,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function TeamPage() {
  const { data: userData } = useCurrentUser();
  const currentTeam = userData?.currentTeam;
  const [activeTab, setActiveTab] = useState<
    "members" | "invites" | "newSchool"
  >("members");

  // Form States
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("faculty");
  const [newSchoolName, setNewSchoolName] = useState("");

  // Feedback States
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { data: teamData, isLoading, error } = useMembers(currentTeam?.id);

  const inviteMutation = useInviteMember(currentTeam?.id);
  const cancelInviteMutation = useCancelInvitation(currentTeam?.id);
  const removeMemberMutation = useRemoveMember(currentTeam?.id);
  const updateRoleMutation = useUpdateMemberRole(currentTeam?.id);
  const createSchoolMutation = useCreateTeam();

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !inviteRole || !currentTeam?.id) {
      setErrorMsg("Email and role are required.");
      return;
    }
    inviteMutation.mutate(
      { teamId: currentTeam.id, email: inviteEmail, role: inviteRole },
      {
        onSuccess: () => {
          setInviteEmail("");
          setInviteRole("faculty");
          setSuccessMsg("Invitation sent successfully.");
          setErrorMsg("");
        },
        onError: (err: any) => {
          setErrorMsg(err.message || "Failed to invite member.");
        },
      },
    );
  };

  const handleCreateSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchoolName.trim()) {
      setErrorMsg("School name is required.");
      return;
    }
    createSchoolMutation.mutate(
      { name: newSchoolName },
      {
        onSuccess: () => {
          setNewSchoolName("");
          setSuccessMsg("New School context created and activated.");
          setActiveTab("members");
          setErrorMsg("");
        },
        onError: (err: any) => {
          setErrorMsg(err.message || "Failed to create new school.");
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-[200px] mb-2" />
          <Skeleton className="h-4 w-[300px]" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-[250px] col-span-2 rounded-xl" />
          <Skeleton className="h-[250px] col-span-1 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !teamData) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-destructive">
        <h2 className="text-lg font-bold">Error loading Staff Roster</h2>
        <p className="text-sm mt-1">
          {error instanceof Error ? error.message : "Something went wrong."}
        </p>
      </div>
    );
  }

  const { team, members, invitations, permissions, availableRoles } = teamData;

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h1 className="text-3xl font-bold tracking-tight">Staff & Roles</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Currently managing:{" "}
          <span className="font-semibold text-foreground">{team.name}</span>
        </p>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-600 dark:text-emerald-500 border border-emerald-500/20 text-left animate-fade-in">
          <Check className="size-4 shrink-0 text-emerald-500" />
          <span className="text-sm font-semibold">{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20 text-left animate-fade-in">
          <AlertCircle className="size-4 shrink-0 text-destructive" />
          <span className="text-sm font-semibold">{errorMsg}</span>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3 items-start">
        {/* Members Roster / Invitations list */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex border-b border-border gap-4">
            <button
              onClick={() => {
                setActiveTab("members");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === "members"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Active Staff ({members.length})
            </button>
            <button
              onClick={() => {
                setActiveTab("invites");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === "invites"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Pending Invites ({invitations.length})
            </button>
            <button
              onClick={() => {
                setActiveTab("newSchool");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === "newSchool"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              New School Context
            </button>
          </div>

          {activeTab === "members" && (
            <Card className="border-border bg-card">
              <CardContent className="p-0">
                <div className="relative w-full overflow-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-border font-medium text-muted-foreground bg-muted/30">
                        <th className="p-4">Staff Name</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">School Role</th>
                        {permissions.canRemoveMember && (
                          <th className="p-4 text-right pr-6">Remove</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((member) => (
                        <tr
                          key={member.id}
                          className="border-b border-border/50 hover:bg-muted/30 transition-all"
                        >
                          <td className="p-4 font-semibold text-foreground">
                            {member.name}
                          </td>
                          <td className="p-4 text-muted-foreground">
                            {member.email}
                          </td>
                          <td className="p-4">
                            {permissions.canUpdateMember &&
                            member.role !== "owner" ? (
                              <select
                                value={member.role}
                                onChange={(e) =>
                                  updateRoleMutation.mutate({
                                    teamId: currentTeam?.id,
                                    memberUserId: member.id,
                                    role: e.target.value,
                                  })
                                }
                                className="h-8 rounded-md border border-input bg-background px-2 text-xs focus:ring-1 focus:ring-primary"
                              >
                                {availableRoles.map((r) => (
                                  <option key={r.value} value={r.value}>
                                    {r.label}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary capitalize">
                                {member.role_label}
                              </span>
                            )}
                          </td>
                          {permissions.canRemoveMember && (
                            <td className="p-4 text-right pr-6">
                              {member.role !== "owner" && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    removeMemberMutation.mutate({
                                      teamId: currentTeam?.id,
                                      memberUserId: member.id,
                                    })
                                  }
                                  disabled={
                                    removeMemberMutation.isPending &&
                                    removeMemberMutation.variables === member.id
                                  }
                                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer size-8"
                                >
                                  {removeMemberMutation.isPending &&
                                  removeMemberMutation.variables ===
                                    member.id ? (
                                    <Loader2 className="size-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="size-4" />
                                  )}
                                </Button>
                              )}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "invites" && (
            <Card className="border-border bg-card">
              <CardContent className="p-0">
                {invitations.length === 0 ? (
                  <div className="py-16 text-center text-muted-foreground flex flex-col items-center justify-center">
                    <Mail className="size-8 stroke-[1.5] mb-2" />
                    <p className="text-sm">No pending invitations found.</p>
                  </div>
                ) : (
                  <div className="relative w-full overflow-auto">
                    <table className="w-full border-collapse text-left text-sm">
                      <thead>
                        <tr className="border-b border-border font-medium text-muted-foreground bg-muted/30">
                          <th className="p-4">Email Address</th>
                          <th className="p-4">Designated Role</th>
                          <th className="p-4">Invited On</th>
                          {permissions.canAddMember && (
                            <th className="p-4 text-right pr-6">Cancel</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {invitations.map((invite) => (
                          <tr
                            key={invite.code}
                            className="border-b border-border/50 hover:bg-muted/30 transition-all"
                          >
                            <td className="p-4 font-semibold text-foreground">
                              {invite.email}
                            </td>
                            <td className="p-4">
                              <span className="inline-flex items-center rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs font-semibold text-yellow-600 dark:text-yellow-500 capitalize">
                                {invite.role_label}
                              </span>
                            </td>
                            <td className="p-4 text-muted-foreground">
                              {new Date(invite.created_at).toLocaleDateString()}
                            </td>
                            {permissions.canAddMember && (
                              <td className="p-4 text-right pr-6">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    cancelInviteMutation.mutate({
                                      teamId: currentTeam?.id,
                                      inviteCode: invite.code,
                                    })
                                  }
                                  disabled={
                                    cancelInviteMutation.isPending &&
                                    cancelInviteMutation.variables ===
                                      invite.code
                                  }
                                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer size-8"
                                >
                                  {cancelInviteMutation.isPending &&
                                  cancelInviteMutation.variables ===
                                    invite.code ? (
                                    <Loader2 className="size-4 animate-spin" />
                                  ) : (
                                    <X className="size-4" />
                                  )}
                                </Button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "newSchool" && (
            <Card className="border-border bg-card">
              <CardHeader className="text-left pb-4 border-b border-border">
                <CardTitle>Register New School / Team</CardTitle>
                <CardDescription>
                  Scaffold a brand new school administration context. You can
                  switch between schools using the top-left sidebar switcher.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleCreateSchool}>
                <CardContent className="space-y-4 pt-6 text-left">
                  <div className="space-y-2">
                    <label
                      htmlFor="schoolName"
                      className="text-sm font-semibold text-foreground"
                    >
                      School / Organization Name *
                    </label>
                    <Input
                      id="schoolName"
                      placeholder="e.g. West Springfield High School"
                      value={newSchoolName}
                      onChange={(e) => setNewSchoolName(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={createSchoolMutation.isPending}
                  >
                    {createSchoolMutation.isPending
                      ? "Onboarding..."
                      : "Onboard New School"}
                  </Button>
                </CardContent>
              </form>
            </Card>
          )}
        </div>

        {/* Invite Form Sidebar (only visible if user canAddMember) */}
        <div className="md:col-span-1">
          {permissions.canAddMember ? (
            <Card className="border-border bg-card">
              <CardHeader className="text-left pb-4 border-b border-border">
                <CardTitle className="text-lg">Invite Staff</CardTitle>
                <CardDescription>
                  Add teachers or admins to this school
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleInvite}>
                <CardContent className="space-y-4 pt-6 text-left">
                  <div className="space-y-2">
                    <label
                      htmlFor="inviteEmail"
                      className="text-sm font-semibold text-foreground"
                    >
                      Email Address *
                    </label>
                    <Input
                      id="inviteEmail"
                      type="email"
                      placeholder="teacher@school.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="inviteRole"
                      className="text-sm font-semibold text-foreground"
                    >
                      Designated Role *
                    </label>
                    <select
                      id="inviteRole"
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-1 focus:ring-primary"
                      required
                    >
                      {availableRoles.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button
                    type="submit"
                    className="w-full cursor-pointer"
                    disabled={inviteMutation.isPending}
                  >
                    {inviteMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Inviting...
                      </>
                    ) : (
                      "Send Invite"
                    )}
                  </Button>
                </CardContent>
              </form>
            </Card>
          ) : (
            <Card className="border-border bg-card">
              <CardContent className="p-6 flex flex-col items-center justify-center text-muted-foreground text-center">
                <Shield className="size-8 stroke-[1.5] mb-2" />
                <p className="text-sm font-medium">
                  Administrative Access Only
                </p>
                <p className="text-xs mt-1">
                  You do not have permissions to invite staff members to this
                  school.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
