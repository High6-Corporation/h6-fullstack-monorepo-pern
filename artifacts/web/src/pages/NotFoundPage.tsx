import { Link } from "react-router-dom"

export default function NotFoundPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-3xl font-semibold">Page not found</h1>
      <p className="text-muted-foreground">
        The page you are looking for does not exist.
      </p>
      <Link to="/" className="text-primary underline">
        Go to dashboard
      </Link>
    </div>
  )
}
