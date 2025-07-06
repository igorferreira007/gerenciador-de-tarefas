import { Request, Response, Router } from "express"
import { UsersController } from "../controllers/users-controller"
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated"
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization"
import { UsersUpdatesController } from "@/controllers/users-updates-controller"
import multer from "multer"
import uploadConfig from "@/configs/upload"

export const usersRoutes = Router()
const usersController = new UsersController()
const usersUpdatesController = new UsersUpdatesController()

const upload = multer(uploadConfig.MULTER)

usersRoutes.post("/", usersController.create)
usersRoutes.get(
  "/",
  ensureAuthenticated,
  verifyUserAuthorization(["admin"]),
  usersController.index
)
usersRoutes.get(
  "/:id",
  ensureAuthenticated,
  verifyUserAuthorization(["admin"]),
  usersController.show
)
usersRoutes.put(
  "/:id",
  ensureAuthenticated,
  verifyUserAuthorization(["admin"]),
  usersController.update
)
usersRoutes.delete(
  "/:id",
  ensureAuthenticated,
  verifyUserAuthorization(["admin"]),
  usersController.remove
)
usersRoutes.patch(
  "/:id/role",
  ensureAuthenticated,
  verifyUserAuthorization(["admin"]),
  usersUpdatesController.roleUpdate
)
usersRoutes.patch(
  "/avatar",
  ensureAuthenticated,
  upload.single("file"),
  usersUpdatesController.userAvatarUpdate
)
