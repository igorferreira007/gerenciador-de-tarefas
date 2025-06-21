import { Router } from "express"
import { TeamMembersController } from "@/controllers/team-members-controller"
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated"
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization"
import { TeamMembersUpdatesController } from "@/controllers/team-members-updates-controller"

export const teamMembersRoutes = Router()
const teamMembersController = new TeamMembersController()
const teamMembersUpdatesController = new TeamMembersUpdatesController()

teamMembersRoutes.use(ensureAuthenticated, verifyUserAuthorization(["admin"]))

teamMembersRoutes.post("/", teamMembersController.create)
teamMembersRoutes.get("/", teamMembersController.index)
teamMembersRoutes.get("/:id", teamMembersController.show)
teamMembersRoutes.delete("/:id", teamMembersController.remove)
teamMembersRoutes.patch(
  "/:id/team-update",
  teamMembersUpdatesController.teamUpdate
)
