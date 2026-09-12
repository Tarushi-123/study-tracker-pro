import { useState, useEffect, Suspense } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Mail, Lock, User } from "lucide-react";

interface AuthProps {
  redirectAfterAuth?: string;
}

function resolveRedirectAfterAuth(
  returnTo: string | null,
  fallback = "/dashboard",
) {
  if (returnTo?.startsWith("/") && !returnTo.startsWith("//")) {
    return returnTo;
  }
  return fallback;
}

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = resolveRedirectAfterAuth(
    searchParams.get("returnTo"),
    redirectAfterAuth,
  );

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(redirect);
    }
  }, [authLoading, isAuthenticated, navigate, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isSignUp) {
        const result = await signUp(email, password, name);
        if (result.error) {
          setError(result.error);
        } else {
          setSuccess("Account created! Please check your email to verify your account.");
        }
      } else {
        const result = await signIn(email, password);
        if (result.error) {
          setError(result.error);
        } else {
          navigate(redirect);
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError(null);
    setSuccess(null);
    setEmail("");
    setPassword("");
    setName("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0e6d8] px-4">
      <div className="w-full max-w-md">
        <Card className="bg-[#faf5ee] border-[#e8dfd2] shadow-[12px_12px_24px_#d4c9ba,-12px_-12px_24px_#ffffff]">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-[#8b7355] to-[#a69580] flex items-center justify-center shadow-[4px_4px_8px_#d4c9ba,-4px_-4px_8px_#ffffff]">
              <span className="text-2xl font-bold text-white">S</span>
            </div>
            <CardTitle className="text-2xl text-[#3d3429]">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </CardTitle>
            <CardDescription className="text-[#8b7355]">
              {isSignUp
                ? "Sign up to start tracking your assignments"
                : "Sign in to access your study dashboard"}
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#5a4d3e]">
                    Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8b7355]" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-9 bg-[#f0e6d8] border-[#e0d5c5] focus:border-[#8b7355] shadow-[inset_2px_2px_4px_#d4c9ba,inset_-2px_-2px_4px_#ffffff]"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#5a4d3e]">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8b7355]" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 bg-[#f0e6d8] border-[#e0d5c5] focus:border-[#8b7355] shadow-[inset_2px_2px_4px_#d4c9ba,inset_-2px_-2px_4px_#ffffff]"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#5a4d3e]">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8b7355]" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 bg-[#f0e6d8] border-[#e0d5c5] focus:border-[#8b7355] shadow-[inset_2px_2px_4px_#d4c9ba,inset_-2px_-2px_4px_#ffffff]"
                    disabled={isLoading}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {success && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                  <p className="text-sm text-emerald-600">{success}</p>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              <Button
                type="submit"
                className="w-full bg-[#8b7355] hover:bg-[#6b5b47] text-white shadow-[4px_4px_8px_#d4c9ba,-4px_-4px_8px_#ffffff]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isSignUp ? "Creating Account..." : "Signing In..."}
                  </>
                ) : isSignUp ? (
                  "Create Account"
                ) : (
                  "Sign In"
                )}
              </Button>

              <p className="text-sm text-[#8b7355]">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-[#6b5b47] font-medium hover:underline"
                  disabled={isLoading}
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default function AuthPage(props: AuthProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f0e6d8]">
          <Loader2 className="h-8 w-8 animate-spin text-[#8b7355]" />
        </div>
      }
    >
      <Auth {...props} />
    </Suspense>
  );
}
