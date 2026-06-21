import React, { useState } from "react";
import { Loader2, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/queries/useAuth";
import {
  useUpdateProfile,
  useChangePassword,
  useDeleteAccount,
} from "@/hooks/queries/useProfile";

export default function SettingsPage() {
  const { data: userData } = useCurrentUser();
  const user = userData?.user;

  const [activeTab, setActiveTab] = useState<"profile" | "password" | "danger">(
    "profile",
  );

  // Profile Form States
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  // Password Form States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [deleteError, setDeleteError] = useState("");

  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  const deleteAccountMutation = useDeleteAccount();

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setProfileError("Name and email are required.");
      return;
    }
    updateProfileMutation.mutate(
      { name, email },
      {
        onSuccess: (data: any) => {
          setProfileSuccess(data.message || "Profile updated successfully.");
          setProfileError("");
        },
        onError: (err: any) => {
          setProfileError(err.message || "Failed to update profile.");
          setProfileSuccess("");
        },
      }
    );
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setPasswordError("Both current password and new password are required.");
      return;
    }
    changePasswordMutation.mutate(
      {
        current_password: currentPassword,
        password: newPassword,
      },
      {
        onSuccess: (data: any) => {
          setPasswordSuccess(data.message || "Password updated successfully.");
          setCurrentPassword("");
          setNewPassword("");
          setPasswordError("");
        },
        onError: (err: any) => {
          setPasswordError(err.message || "Failed to update password.");
          setPasswordSuccess("");
        },
      }
    );
  };

  const handleDeleteAccount = () => {
    if (
      confirm(
        "Are you absolutely sure you want to delete your account? This action is permanent and cannot be undone.",
      )
    ) {
      deleteAccountMutation.mutate(undefined, {
        onError: (err: any) => {
          setDeleteError(err.message || "Failed to delete account.");
        },
      });
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Customize your profile, configure account passwords, or manage account
          safety.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-4 items-start">
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 flex flex-col gap-1 border-r border-border pr-6 text-left">
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "profile"
                ? "bg-primary/10 text-primary"
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "password"
                ? "bg-primary/10 text-primary"
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Update Password
          </button>
          <button
            onClick={() => setActiveTab("danger")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "danger"
                ? "bg-destructive/10 text-destructive"
                : "hover:bg-destructive/5 text-muted-foreground hover:text-destructive"
            }`}
          >
            Danger Zone
          </button>
        </div>

        {/* Content Console */}
        <div className="md:col-span-3">
          {/* Profile Form */}
          {activeTab === "profile" && (
            <Card className="border-border bg-card">
              <CardHeader className="text-left pb-4 border-b border-border">
                <CardTitle>Profile Details</CardTitle>
                <CardDescription>
                  Update your personal information and contact email address.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleUpdateProfile}>
                <CardContent className="space-y-4 pt-6 text-left">
                  {profileSuccess && (
                    <div className="mb-4 flex items-center gap-2 rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-600 dark:text-emerald-500 border border-emerald-500/20 animate-fade-in">
                      <Check className="size-4 text-emerald-500 shrink-0" />
                      <span className="text-xs font-semibold">
                        {profileSuccess}
                      </span>
                    </div>
                  )}

                  {profileError && (
                    <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20 animate-fade-in">
                      <AlertCircle className="size-4 text-destructive shrink-0" />
                      <span className="text-xs font-semibold">
                        {profileError}
                      </span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label
                      htmlFor="profName"
                      className="text-sm font-semibold text-foreground"
                    >
                      Full Name
                    </label>
                    <Input
                      id="profName"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="profEmail"
                      className="text-sm font-semibold text-foreground"
                    >
                      Email Address
                    </label>
                    <Input
                      id="profEmail"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    className="cursor-pointer"
                  >
                    {updateProfileMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Details"
                    )}
                  </Button>
                </CardContent>
              </form>
            </Card>
          )}

          {/* Password Form */}
          {activeTab === "password" && (
            <Card className="border-border bg-card">
              <CardHeader className="text-left pb-4 border-b border-border">
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Improve your safety credentials with a strong password.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handlePasswordChange}>
                <CardContent className="space-y-4 pt-6 text-left">
                  {passwordSuccess && (
                    <div className="mb-4 flex items-center gap-2 rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-600 dark:text-emerald-500 border border-emerald-500/20 animate-fade-in">
                      <Check className="size-4 text-emerald-500 shrink-0" />
                      <span className="text-xs font-semibold">
                        {passwordSuccess}
                      </span>
                    </div>
                  )}

                  {passwordError && (
                    <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20 animate-fade-in">
                      <AlertCircle className="size-4 text-destructive shrink-0" />
                      <span className="text-xs font-semibold">
                        {passwordError}
                      </span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label
                      htmlFor="currPass"
                      className="text-sm font-semibold text-foreground"
                    >
                      Current Password *
                    </label>
                    <Input
                      id="currPass"
                      type="password"
                      placeholder="Enter your current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="newPass"
                      className="text-sm font-semibold text-foreground"
                    >
                      New Password *
                    </label>
                    <Input
                      id="newPass"
                      type="password"
                      placeholder="At least 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={changePasswordMutation.isPending}
                    className="cursor-pointer"
                  >
                    {changePasswordMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Changing...
                      </>
                    ) : (
                      "Change Password"
                    )}
                  </Button>
                </CardContent>
              </form>
            </Card>
          )}

          {/* Danger Zone */}
          {activeTab === "danger" && (
            <Card className="border-destructive/20 bg-destructive/5">
              <CardHeader className="text-left pb-4 border-b border-destructive/10">
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>
                  High risk operations. Please read notes carefully.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6 text-left">
                {deleteError && (
                  <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20 animate-fade-in">
                    <AlertCircle className="size-4 text-destructive shrink-0" />
                    <span className="text-xs font-semibold">{deleteError}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-foreground">
                    Delete Account Permanent
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    This will permanently delete your account, remove your
                    associations from all teams, and log you out. This process
                    is irreversible.
                  </p>
                </div>

                <div className="pt-2">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={deleteAccountMutation.isPending}
                    className="cursor-pointer"
                  >
                    {deleteAccountMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting Account...
                      </>
                    ) : (
                      "Delete My Account"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
