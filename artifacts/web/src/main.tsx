import React from "react"
import ReactDOM from "react-dom/client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter } from "react-router-dom"
import { ClerkProvider } from "@clerk/clerk-react"
import { App } from "./App"
import { AuthProvider } from "./components/AuthProvider"
import { ThemeProvider } from "./context/ThemeProvider"
import { TooltipProvider } from "./components/ui/tooltip"
import { Toaster } from "./components/ui/sonner"
import { AUTH_BYPASS } from "./lib/authBypass"
import "./styles/globals.css"

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: 1 },
  },
})

const inner = (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <App />
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </BrowserRouter>
)

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {AUTH_BYPASS ? (
      inner
    ) : (
      <ClerkProvider publishableKey={clerkPublishableKey}>
        {inner}
      </ClerkProvider>
    )}
  </React.StrictMode>
)
