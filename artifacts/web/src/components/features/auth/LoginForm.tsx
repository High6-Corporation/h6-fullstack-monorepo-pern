import { useNavigate } from "react-router-dom"
import { SignIn } from "@clerk/clerk-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AUTH_BYPASS } from "@/lib/authBypass"

export function LoginForm() {
  const navigate = useNavigate()

  if (AUTH_BYPASS) {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Auth bypass active</CardTitle>
          <CardDescription>
            Login is disabled in this environment. Set{" "}
            <code>VITE_CLERK_PUBLISHABLE_KEY</code> to enable Clerk sign-in.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button onClick={() => navigate("/")}>Go to dashboard</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>Sign in with Clerk to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <SignIn routing="path" path="/login" signUpUrl="/login" />
      </CardContent>
    </Card>
  )
}
