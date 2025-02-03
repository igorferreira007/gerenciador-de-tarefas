import { SessionsController } from "@/controllers/sessions-controller"
import { Router } from "express"

export const sessionsRoutes = Router()
const sessionsController = new SessionsController()

sessionsRoutes.post("/", sessionsController.create)