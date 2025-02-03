import { Request, Response, Router } from "express"
import { TasksController } from "@/controllers/tasks-controller"
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated"
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization"
import { checkUserTeam } from "@/middlewares/check-user-team"
import { TasksUpdatesController } from "@/controllers/tasks-updates-controller"

export const tasksRoutes = Router()
const tasksController = new TasksController()
const tasksUpdatesController = new TasksUpdatesController()

tasksRoutes.use(ensureAuthenticated)

tasksRoutes.post("/", verifyUserAuthorization(["admin"]), tasksController.create)
tasksRoutes.delete("/:id", verifyUserAuthorization(["admin"]), tasksController.remove)
tasksRoutes.get("/", checkUserTeam, tasksController.index)
tasksRoutes.get("/:id", checkUserTeam, tasksController.show)
tasksRoutes.put("/:id", checkUserTeam, tasksController.update)

tasksRoutes.patch("/:id/assigned-to", verifyUserAuthorization(["admin"]), tasksUpdatesController.assignedToUpdate)
tasksRoutes.patch("/:id/status", checkUserTeam, tasksUpdatesController.statusUpdate)
tasksRoutes.patch("/:id/priority", checkUserTeam, tasksUpdatesController.priorityUpdate)