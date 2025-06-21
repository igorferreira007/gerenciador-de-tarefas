import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { Request, Response } from "express"
import z from "zod"

export class TeamMembersUpdatesController {
  async teamUpdate(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const bodySchema = z.object({
      teamId: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const teamMember = await prisma.teamMember.findFirst({ where: { id } })

    if (!teamMember) {
      throw new AppError("Membro da equipe não encontrado.")
    }

    const { teamId } = bodySchema.parse(request.body)

    await prisma.teamMember.update({
      data: {
        teamId,
      },
      where: {
        id,
      },
    })

    return response.json()
  }
}
