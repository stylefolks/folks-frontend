import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { login } from "@/lib/auth";
import { UserDto } from "@/dto/userDto";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMeta } from "@/lib/meta";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  useMeta({ title: "Login - Stylefolks" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isValid = email.length > 0 && password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user: UserDto = await login(email, password);
      const from = (location.state as any)?.from?.pathname || "/";
      navigate(from);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md p-10 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Folks</h1>
          <p className="text-sm text-gray-400">Make culture</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="email"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border py-2 px-3"
            required
          />
          <Input
            name="password"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={cn(
              "rounded-lg border py-2 px-3",
              error && "border-red-500"
            )}
            required
          />
          {error && (
            <p className="text-red-500 text-sm">
              잘못된 이메일 또는 비밀번호입니다.
            </p>
          )}
          <Button
            type="submit"
            disabled={!isValid}
            className="w-full bg-black text-white rounded-xl py-2"
          >
            Login
          </Button>
        </form>
        <div className="text-sm flex justify-between text-black">
          <Link to="/signup">Sign Up</Link>
          <Link to="/reset-password">Forgot Password?</Link>
        </div>
        <p className="text-xs text-gray-400 text-center">
          계속 진행하면 Folks의 서비스 이용약관과 개인정보처리방침에 동의하게
          됩니다.
        </p>
      </div>
    </div>
  );
}
