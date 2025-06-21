import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { Request, Response } from "express"
import z from "zod"

export class UsersUpdatesController {
  async roleUpdate(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const bodySchema = z.object({
      role: z.enum(["admin", "member"]),
    })

    const { id } = paramsSchema.parse(request.params)

    const user = await prisma.user.findFirst({ where: { id } })

    if (!user) {
      throw new AppError("Esse usuário não existe")
    }

    const { role } = bodySchema.parse(request.body)

    await prisma.user.update({
      data: {
        role,
      },
      where: {
        id,
      },
    })

    return response.json()
  }
}
