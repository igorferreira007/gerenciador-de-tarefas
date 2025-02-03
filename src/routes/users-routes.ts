import { Router } from "express"
import { UsersController } from "../controllers/users-controller"
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated"
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization"

export const usersRoutes = Router()
const usersController = new UsersController()

usersRoutes.post("/", usersController.create)
usersRoutes.get("/", ensureAuthenticated, verifyUserAuthorization(["admin"]), usersController.index)
usersRoutes.get("/:id", ensureAuthenticated, verifyUserAuthorization(["admin"]), usersController.show)
usersRoutes.put("/:id", ensureAuthenticated, verifyUserAuthorization(["admin"]), usersController.update)
usersRoutes.delete("/:id", ensureAuthenticated, verifyUserAuthorization(["admin"]), usersController.remove)