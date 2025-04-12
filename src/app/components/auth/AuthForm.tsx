import { useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { ErrorMessage } from "../ui/ErrorMessage";

interface AuthFormProps {
  type: "signin" | "signup";
  onSubmit: (email: string, password: string) => Promise<void>;
  error?: string;
  isLoading?: boolean;
}

export function AuthForm({ type, onSubmit, error, isLoading }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password);
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <ErrorMessage message={error || ''} />
      
      <div className="space-y-4">
        <Input
          id="email"
          name="email"
          type="email"
          label="Email address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <Button
        type="submit"
        fullWidth
        isLoading={isLoading}
      >
        {type === "signin" ? "Sign in" : "Sign up"}
      </Button>
    </form>
  );
} 