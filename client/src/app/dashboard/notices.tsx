import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from '@/lib/api';
import { useAuth } from "@/contexts/AuthContext";
import {
  Megaphone,
  Plus,
  X,
  Calendar,
  User,
  AlertCircle,
  Check,
  Loader2,
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

interface Notice {
  id: string;
  title: string;
  content: string;
  targetAudience: string;
  createdAt: string;
  createdBy: {
    name: string;
    role: string;
  };
}

interface NoticesResponse {
  notices: Notice[];
}

export default function NoticesPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form States
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [targetAudience, setTargetAudience] = useState("all");
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const userRole = user?.role || "member";
  const canPublish = ["owner", "admin", "principal"].includes(userRole);

  const { data, isLoading, error } = useQuery<NoticesResponse>({
    queryKey: ["notices"],
    queryFn: () => api.get("/api/notices").then(res => res.data),
  });

  const createNoticeMutation = useMutation({
    mutationFn: (payload: {
      title: string;
      content: string;
      targetAudience: string;
    }) =>
      api.post("/api/notices", JSON.stringify(payload),).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      setIsModalOpen(false);
      setTitle("");
      setContent("");
      setTargetAudience("all");
      setSubmitError("");
      setSuccessMessage("Notice published successfully.");
      setTimeout(() => setSuccessMessage(""), 5000);
    },
    onError: (err: any) => {
      setSubmitError(err.message || "Failed to publish notice.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !targetAudience) {
      setSubmitError("All fields are required.");
      return;
    }
    createNoticeMutation.mutate({ title, content, targetAudience });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-[200px] mb-2" />
            <Skeleton className="h-4 w-[300px]" />
          </div>
          {canPublish && <Skeleton className="h-10 w-[120px]" />}
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Card key={idx}>
              <CardHeader>
                <Skeleton className="h-6 w-[250px] mb-2" />
                <Skeleton className="h-4 w-[150px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-destructive">
        <h2 className="text-lg font-bold">Error loading announcements</h2>
        <p className="text-sm mt-1">
          {error instanceof Error ? error.message : "Something went wrong."}
        </p>
      </div>
    );
  }

  const notices = data?.notices || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-left">
          <h1 className="text-3xl font-bold tracking-tight">Notice Board</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Stay updated with school announcements, events, and important
            circulars.
          </p>
        </div>
        {canPublish && (
          <Button
            onClick={() => setIsModalOpen(true)}
            className="cursor-pointer"
          >
            <Plus className="size-4 mr-2" />
            Publish Notice
          </Button>
        )}
      </div>

      {successMessage && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-600 dark:text-emerald-500 border border-emerald-500/20 text-left animate-fade-in">
          <Check className="size-4 shrink-0 text-emerald-500" />
          <span className="text-sm font-semibold">{successMessage}</span>
        </div>
      )}

      {notices.length === 0 ? (
        <Card className="border-dashed border-2 py-16 flex flex-col items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
            <Megaphone className="size-6" />
          </div>
          <h3 className="font-semibold text-lg text-foreground">
            Announcements Feed Empty
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm text-center">
            There are no active notices or bulletins currently published for
            your account.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {notices.map((notice) => {
            const badgeColor =
              notice.targetAudience === "all"
                ? "bg-blue-500/10 text-blue-500"
                : notice.targetAudience === "faculty"
                  ? "bg-purple-500/10 text-purple-500"
                  : notice.targetAudience === "student"
                    ? "bg-yellow-500/10 text-yellow-500"
                    : "bg-emerald-500/10 text-emerald-500";

            return (
              <Card
                key={notice.id}
                className="border-border bg-card hover:shadow-md transition-all text-left"
              >
                <CardHeader className="pb-2 border-b border-border/40">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <CardTitle className="text-lg font-bold text-foreground">
                      {notice.title}
                    </CardTitle>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ${badgeColor}`}
                    >
                      Target: {notice.targetAudience}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-2">
                    <span className="flex items-center gap-1.5">
                      <User className="size-3.5" />
                      By: {notice.createdBy.name} ({notice.createdBy.role})
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="size-3.5" />
                      Published:{" "}
                      {new Date(notice.createdAt).toLocaleDateString(
                        undefined,
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
                    {notice.content}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Publish Notice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <Card className="w-full max-w-lg bg-card border-border my-8 animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="relative text-left pb-4 border-b border-border">
              <CardTitle className="text-xl">Publish Announcement</CardTitle>
              <CardDescription>
                Broadsheet a circular to specific sections of the school.
              </CardDescription>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:bg-muted cursor-pointer"
              >
                <X className="size-4" />
              </Button>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4 pt-6 text-left">
                {submitError && (
                  <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20 animate-fade-in">
                    <AlertCircle className="size-4 shrink-0 text-destructive" />
                    <span className="text-xs font-semibold">{submitError}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <label
                    htmlFor="noticeTitle"
                    className="text-sm font-semibold text-foreground"
                  >
                    Notice Title *
                  </label>
                  <Input
                    id="noticeTitle"
                    placeholder="e.g. Mid-Term Examination Schedule, Annual Day Rehearsal"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="audienceSelect"
                    className="text-sm font-semibold text-foreground"
                  >
                    Target Audience *
                  </label>
                  <select
                    id="audienceSelect"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="all">
                      Everyone (All Students & Faculty)
                    </option>
                    <option value="faculty">Faculty & Staff Only</option>
                    <option value="student">Students & Parents Only</option>
                    <option value="admin">Administrators Only</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="noticeContent"
                    className="text-sm font-semibold text-foreground"
                  >
                    Notice Description / Content *
                  </label>
                  <textarea
                    id="noticeContent"
                    rows={6}
                    placeholder="Type details of the notice, including date, time, venue, and instructions..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  />
                </div>
              </CardContent>

              <div className="flex justify-end gap-3 p-6 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createNoticeMutation.isPending}>
                  {createNoticeMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    "Publish Notice"
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
