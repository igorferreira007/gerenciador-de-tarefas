import { RolesController } from "@/controllers/roles-controller"
import { Router } from "express"

export const rolesRoutes = Router()
const rolesController = new RolesController()

rolesRoutes.get("/", rolesController.index)
