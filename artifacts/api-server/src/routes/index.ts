import { Router } from "express"
import multer from "multer"
import { requireAuth } from "../middlewares/auth.js"
import { AuthController } from "../controllers/AuthController.js"
import { AccountController } from "../controllers/AccountController.js"
import { UsersController } from "../controllers/UsersController.js"
import { PostsController } from "../controllers/PostsController.js"
import { DepartmentsController } from "../controllers/DepartmentsController.js"
import { SettingsController } from "../controllers/SettingsController.js"
import { UploadController } from "../controllers/UploadController.js"

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
})

export const apiRouter = Router()

apiRouter.get("/auth/me", AuthController.me)

// --- account (self-service for current user) ---
apiRouter.get("/account", requireAuth, AccountController.show)
apiRouter.patch("/account/profile", requireAuth, AccountController.updateProfile)
apiRouter.get("/account/security", requireAuth, AccountController.security)
apiRouter.patch("/account/password", requireAuth, AccountController.changePassword)

// --- users ---
apiRouter.get("/users", requireAuth, UsersController.index)
apiRouter.post("/users", requireAuth, UsersController.store)
apiRouter.get("/users/:id", requireAuth, UsersController.show)
apiRouter.patch("/users/:id", requireAuth, UsersController.update)
apiRouter.delete("/users/:id", requireAuth, UsersController.destroy)


// --- departments: gold-standard sample module ---
apiRouter.get("/departments", requireAuth, DepartmentsController.index)
apiRouter.post("/departments", requireAuth, DepartmentsController.store)
apiRouter.get("/departments/:id", requireAuth, DepartmentsController.show)
apiRouter.patch("/departments/:id", requireAuth, DepartmentsController.update)
apiRouter.delete("/departments/:id", requireAuth, DepartmentsController.destroy)

// --- posts ---
apiRouter.get("/posts", requireAuth, PostsController.index)
apiRouter.post("/posts", requireAuth, PostsController.store)
apiRouter.get("/posts/:id", requireAuth, PostsController.show)
apiRouter.patch("/posts/:id", requireAuth, PostsController.update)
apiRouter.delete("/posts/:id", requireAuth, PostsController.destroy)

// --- settings ---
apiRouter.get("/settings/general", SettingsController.general)
apiRouter.patch("/settings/general", requireAuth, SettingsController.updateGeneral)
apiRouter.get("/settings/appearance", SettingsController.appearance)
apiRouter.patch(
  "/settings/appearance",
  requireAuth,
  SettingsController.updateAppearance
)
apiRouter.get(
  "/settings/notifications",
  requireAuth,
  SettingsController.notifications
)
apiRouter.patch(
  "/settings/notifications",
  requireAuth,
  SettingsController.updateNotifications
)
apiRouter.get("/settings/help-center", SettingsController.helpCenter)
apiRouter.patch(
  "/settings/help-center",
  requireAuth,
  SettingsController.updateHelpCenter
)

// --- uploads ---
apiRouter.post(
  "/uploads/app-logo",
  requireAuth,
  upload.single("file"),
  UploadController.appLogo
)
apiRouter.post(
  "/uploads/app-icon",
  requireAuth,
  upload.single("file"),
  UploadController.appIcon
)
apiRouter.post(
  "/uploads/avatar",
  requireAuth,
  upload.single("file"),
  UploadController.avatar
)
apiRouter.post(
  "/uploads/user-manual",
  requireAuth,
  upload.single("file"),
  UploadController.userManual
)
