import { Router } from "express"
import { TasksLogsController } from "@/controllers/tasks-logs-controller"
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated"
import { checkUserTeam } from "@/middlewares/check-user-team"

export const tasksLogsRoutes = Router()
const tasksLogsController = new TasksLogsController()

tasksLogsRoutes.use(ensureAuthenticated)

tasksLogsRoutes.get("/", checkUserTeam, tasksLogsController.index)