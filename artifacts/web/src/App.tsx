import { Navigate, Route, Routes } from "react-router-dom"
import { lazy, Suspense } from "react"
import { ProtectedRoute } from "./routes/ProtectedRoute"
import { GuestRoute } from "./routes/GuestRoute"
import { AuthLayout } from "./layouts/AuthLayout"
import { GuestLayout } from "./layouts/GuestLayout"

const LoginPage = lazy(() => import("./pages/login/LoginPage"))
const DashboardPage = lazy(() => import("./pages/dashboard/DashboardPage"))
const UsersIndexPage = lazy(() => import("./pages/users/UsersIndexPage"))
const UserDetailPage = lazy(() => import("./pages/users/UserDetailPage"))
const PostsIndexPage = lazy(() => import("./pages/posts/PostsIndexPage"))
const PostDetailPage = lazy(() => import("./pages/posts/PostDetailPage"))
const DepartmentsIndexPage = lazy(() => import("./pages/departments/DepartmentsIndexPage"))
const AccountIndexPage = lazy(() => import("./pages/account/AccountIndexPage"))
const ProfilePage = lazy(() => import("./pages/account/ProfilePage"))
const SecurityPage = lazy(() => import("./pages/account/SecurityPage"))
const SettingsIndexPage = lazy(
  () => import("./pages/settings/SettingsIndexPage")
)
const GeneralSettingsPage = lazy(
  () => import("./pages/settings/GeneralSettingsPage")
)
const AppearanceSettingsPage = lazy(
  () => import("./pages/settings/AppearanceSettingsPage")
)
const NotificationsSettingsPage = lazy(
  () => import("./pages/settings/NotificationsSettingsPage")
)
const HelpCenterSettingsPage = lazy(
  () => import("./pages/settings/HelpCenterSettingsPage")
)
const HelpCenterPage = lazy(() => import("./pages/help-center/HelpCenterPage"))
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"))

export function App() {
  return (
    <Suspense fallback={<div className="p-8 text-muted-foreground">Loading…</div>}>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route element={<GuestLayout />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AuthLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="/users" element={<UsersIndexPage />} />
            <Route path="/users/:id" element={<UserDetailPage />} />
            <Route path="/departments" element={<DepartmentsIndexPage />} />
            <Route path="/posts" element={<PostsIndexPage />} />
            <Route path="/posts/:id" element={<PostDetailPage />} />
            <Route path="/account" element={<AccountIndexPage />} />
            <Route path="/account/profile" element={<ProfilePage />} />
            <Route path="/account/security" element={<SecurityPage />} />
            <Route path="/settings" element={<SettingsIndexPage />} />
            <Route path="/settings/general" element={<GeneralSettingsPage />} />
            <Route
              path="/settings/appearance"
              element={<AppearanceSettingsPage />}
            />
            <Route
              path="/settings/notifications"
              element={<NotificationsSettingsPage />}
            />
            <Route
              path="/settings/help-center"
              element={<HelpCenterSettingsPage />}
            />
            <Route path="/help-center" element={<HelpCenterPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
        <Route path="/index" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
