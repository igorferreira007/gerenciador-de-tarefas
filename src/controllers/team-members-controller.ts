import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { Request, Response } from "express"
import z from "zod"

export class TeamMembersController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      user_id: z.string().uuid(),
      team_id: z.string().uuid(),
    })

    const { user_id, team_id } = bodySchema.parse(request.body)

    const userExists = await prisma.user.findFirst({ where: { id: user_id } })

    if (!userExists) {
      throw new AppError("Esse usuário não existe")
    }

    const teamExists = await prisma.team.findFirst({ where: { id: team_id } })

    if (!teamExists) {
      throw new AppError("Essa equipe não existe")
    }

    const userWithTeam = await prisma.teamMember.findFirst({
      where: { userId: user_id },
    })

    if (userWithTeam) {
      throw new AppError("Esse usuário já pertence a uma equipe")
    }

    await prisma.teamMember.create({
      data: {
        userId: user_id,
        teamId: team_id,
      },
    })

    return response.status(201).json()
  }

  async index(request: Request, response: Response) {
    const querySchema = z.object({
      teamName: z.string().trim().optional(),
      userName: z.string().trim().optional(),
      teamId: z.string().optional(),
    })

    const { teamName, userName, teamId } = querySchema.parse(request.query)

    const teamMembers = await prisma.teamMember.findMany({
      include: {
        team: {
          select: { name: true },
        },
        user: {
          select: {
            name: true,
            email: true,
            role: true,
            createdAt: true,
          },
        },
      },
      where: {
        team: {
          name: {
            contains: teamName?.toString(),
            mode: "insensitive",
          },
          id: teamId,
        },
        user: {
          name: {
            contains: userName?.toString(),
            mode: "insensitive",
          },
        },
      },
    })

    if (!teamMembers) {
      throw new AppError("Ainda não existem membros em equipes")
    }

    return response.json(teamMembers)
  }

  async show(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const teamMember = await prisma.teamMember.findFirst({
      where: { id },
      include: {
        team: {
          select: { name: true },
        },
        user: {
          select: { name: true },
        },
      },
    })

    if (!teamMember) {
      throw new AppError("Essa equipe não existe")
    }

    return response.json(teamMember)
  }

  async remove(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const teamMember = await prisma.teamMember.findFirst({ where: { id } })

    if (!teamMember) {
      throw new AppError("Essa equipe não existe")
    }

    await prisma.teamMember.delete({ where: { id } })

    return response.json()
  }
}
