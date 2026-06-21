import {
  Users,
  School,
  BookOpen,
  DollarSign,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStats } from "@/hooks/queries/useFeatures";

export default function DashboardOverview() {
  const { data, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-[250px] mb-2" />
          <Skeleton className="h-4 w-[400px]" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Card key={idx}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px]" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="col-span-4">
          <CardHeader>
            <Skeleton className="h-6 w-[200px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Skeleton key={idx} className="h-10 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-destructive">
        <h2 className="text-lg font-bold">Error loading Dashboard</h2>
        <p className="text-sm mt-1">
          {error instanceof Error ? error.message : "Something went wrong."}
        </p>
      </div>
    );
  }

  const stats = data?.stats || {
    studentsCount: 0,
    classesCount: 0,
    subjectsCount: 0,
    revenueCollected: 0,
  };

  const recentPayments = data?.recentPayments || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-left">
          Dashboard
        </h1>
        <p className="text-muted-foreground text-left text-sm mt-1">
          Welcome to eduFlow. Here is what is happening at your school today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Students */}
        <Card className="hover:shadow-md transition-all border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Total Students
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
              <Users className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="text-left">
            <div className="text-2xl font-bold">{stats.studentsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Enrolled and active students
            </p>
          </CardContent>
        </Card>

        {/* Total Classes */}
        <Card className="hover:shadow-md transition-all border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Active Classes
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
              <School className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="text-left">
            <div className="text-2xl font-bold">{stats.classesCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Academic grade sections
            </p>
          </CardContent>
        </Card>

        {/* Subjects */}
        <Card className="hover:shadow-md transition-all border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Total Subjects
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-500">
              <BookOpen className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="text-left">
            <div className="text-2xl font-bold">{stats.subjectsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Courses mapped to classes
            </p>
          </CardContent>
        </Card>

        {/* Revenue Collected */}
        <Card className="hover:shadow-md transition-all border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Fees Revenue
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <DollarSign className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="text-left">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">
              $
              {stats.revenueCollected.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-500 flex items-center gap-1 mt-1 font-medium">
              <TrendingUp className="size-3" />
              Total funds collected
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Payments Table */}
      <div className="grid gap-6 md:grid-cols-1">
        <Card className="col-span-1 border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="text-left">
              <CardTitle className="text-lg">Recent Fee Payments</CardTitle>
              <CardDescription>
                Latest transaction history for student fee collections
              </CardDescription>
            </div>
            <ArrowUpRight className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {recentPayments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <DollarSign className="size-8 stroke-[1.5] mb-2" />
                <p className="text-sm">No payments recorded yet.</p>
              </div>
            ) : (
              <div className="relative w-full overflow-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-border font-medium text-muted-foreground">
                      <th className="p-3 pl-0">Student</th>
                      <th className="p-3">Fee Category</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Date</th>
                      <th className="p-3 text-right pr-0">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPayments.map((payment) => (
                      <tr
                        key={payment.id}
                        className="border-b border-border/50 hover:bg-muted/40 transition-all"
                      >
                        <td className="p-3 pl-0 font-medium text-foreground">
                          {payment.studentName}
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {payment.categoryName}
                        </td>
                        <td className="p-3 font-semibold text-emerald-600 dark:text-emerald-500">
                          ${Number(payment.amount).toFixed(2)}
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {new Date(payment.date).toLocaleDateString(
                            undefined,
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </td>
                        <td className="p-3 text-right pr-0">
                          <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-500">
                            Paid
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
