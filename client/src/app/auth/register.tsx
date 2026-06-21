import * as React from "react";
import { useState } from "react";
import { useRegister } from "@/hooks/queries/useAuth";
import { useNavigate, Link } from "react-router-dom";
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

export default function RegisterPage() {
  const registerMutation = useRegister();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      await registerMutation.mutateAsync({
        name,
        email,
        password,
        company_name: schoolName,
      });
      navigate("/dashboard");
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-muted/20 py-12 md:py-16">
      <div className="w-full max-w-sm md:max-w-4xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden p-0 shadow-2xl border-border/40 rounded-3xl bg-background/50 backdrop-blur-xl">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form
                onSubmit={handleSubmit}
                className="p-6 md:p-8 flex flex-col justify-center"
              >
                <FieldGroup>
                  <div className="flex flex-col items-center gap-2 text-center mb-4">
                    <h1 className="text-3xl font-bold tracking-tight">
                      Register School
                    </h1>
                    <p className="text-balance text-sm text-muted-foreground">
                      Create an administrator account for your school
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20 animate-fade-in">
                      <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
                      <span className="text-xs font-semibold">{errorMsg}</span>
                    </div>
                  )}

                  <Field>
                    <FieldLabel htmlFor="name">Admin Full Name</FieldLabel>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Principal Skinner"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="email">Email Address</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="skinner@springfield.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="schoolName">
                      School / Organization Name
                    </FieldLabel>
                    <Input
                      id="schoolName"
                      type="text"
                      placeholder="Springfield Elementary School"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      placeholder="At least 6 characters"
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
                          Creating Account...
                        </>
                      ) : (
                        "Register School"
                      )}
                    </Button>
                  </Field>

                  <FieldDescription className="text-center mt-4">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="underline hover:text-primary font-medium"
                    >
                      Login here
                    </Link>
                  </FieldDescription>
                </FieldGroup>
              </form>
              <div className="relative hidden bg-muted md:block">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-purple-500/20 mix-blend-multiply z-10" />
                <img
                  src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop"
                  alt="Students Studying"
                  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.3]"
                />
                <div className="absolute bottom-8 left-8 right-8 z-20 text-white p-6 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl">
                  <h3 className="font-bold text-lg">
                    Streamline School Workflows
                  </h3>
                  <p className="text-xs text-white/80 mt-1">
                    Onboard your school in minutes and start managing your
                    classes, attendance rosters, and student admissions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
