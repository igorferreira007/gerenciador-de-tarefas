import { UserRole } from "@prisma/client"
import { Request, Response } from "express"

export class RolesController {
  index(request: Request, response: Response) {
    console.log("Entrou no RolesController")
    const roles = Object.values(UserRole)

    return response.json(roles)
  }
}
