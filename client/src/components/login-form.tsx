import * as React from "react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Loader2, AlertCircle } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 shadow-lg border-border">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            onSubmit={handleSubmit}
            className="p-6 md:p-8 flex flex-col justify-center"
          >
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center mb-4">
                <h1 className="text-3xl font-bold tracking-tight">
                  Welcome back
                </h1>
                <p className="text-balance text-sm text-muted-foreground">
                  Login to your eduFlow account
                </p>
              </div>

              {errorMsg && (
                <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20 animate-fade-in">
                  <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
                  <span className="text-xs font-semibold">{errorMsg}</span>
                </div>
              )}

              <Field>
                <FieldLabel htmlFor="email">Email Address</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@school.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </Field>

              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </Field>

              <Field className="mt-2">
                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </Field>

              <FieldDescription className="text-center mt-4">
                Don&apos;t have an account?{" "}
                <Link
                  to="/register"
                  className="underline hover:text-primary font-medium"
                >
                  Register School
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-purple-500/20 mix-blend-multiply z-10" />
            <img
              src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop"
              alt="School Campus"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.3]"
            />
            <div className="absolute bottom-6 left-6 right-6 z-20 text-white p-4 rounded-lg bg-black/40 backdrop-blur-md border border-white/10">
              <h3 className="font-bold text-lg">eduFlow Management</h3>
              <p className="text-xs text-white/80 mt-1">
                An all-in-one suite to manage classes, tracking attendance,
                student directories, and school finances.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
