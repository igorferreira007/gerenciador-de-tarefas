import { Router } from "express"
import { usersRoutes } from "./users-routes"
import { sessionsRoutes } from "./sessions-routes"
import { teamsRoutes } from "./teams-routes"
import { teamMembersRoutes } from "./team-members-routes"
import { tasksRoutes } from "./tasks-routes"
import { tasksLogsRoutes } from "./tasks-logs-routes"

export const router = Router()

router.use("/users", usersRoutes)
router.use("/sessions", sessionsRoutes)
router.use("/teams", teamsRoutes)
router.use("/team-members", teamMembersRoutes)
router.use("/tasks", tasksRoutes)
router.use("/task-history", tasksLogsRoutes)