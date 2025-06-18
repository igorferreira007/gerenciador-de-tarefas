import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { Prisma } from "@prisma/client"
import { Request, Response } from "express"
import z from "zod"

export class TasksController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      title: z.string().trim(),
      description: z.string().trim(),
      priority: z.enum(["low", "medium", "high"]).default("low").optional(),
      team_id: z.string().uuid(),
    })

    const { title, description, priority, team_id } = bodySchema.parse(
      request.body
    )

    const team = await prisma.team.findFirst({ where: { id: team_id } })

    if (!team) {
      throw new AppError("Essa equipe não existe")
    }

    await prisma.task.create({
      data: {
        title,
        description,
        priority,
        teamId: team_id,
      },
    })

    return response.json()
  }

  async index(request: Request, response: Response) {
    const userSchema = z.object({
      role: z.enum(["admin", "member"]),
      teamId: z.string().uuid().optional(),
    })

    const { role, teamId } = userSchema.parse(request.user)

    const querySchema = z.object({
      priority: z.enum(["low", "medium", "high"]).optional(),
      status: z.enum(["pending", "inProgress", "completed"]).optional(),
      title: z.string().trim().optional(),
      userName: z.string().trim().optional(),
      page: z.coerce.number().optional().default(1),
      perPage: z.coerce.number().optional().default(10),
    })

    const { priority, status, title, userName, page, perPage } =
      querySchema.parse(request.query)

    const skip = (page - 1) * perPage

    const filters: Prisma.TaskWhereInput = {
      ...(priority && { priority }),
      ...(status && { status }),
      ...(title && { title: { contains: title, mode: "insensitive" } }),
      ...(role !== "admin" && teamId && { teamId }),
    }

    const tasks = await prisma.task.findMany({
      skip,
      take: perPage,
      where: filters,
      include: {
        user: {
          select: {
            name: true,
          },
        },
        team: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    const totalRecords = await prisma.task.count({
      where: filters,
    })

    const totalPages = Math.ceil(totalRecords / perPage)

    return response.json({
      tasks,
      pagination: {
        page,
        perPage,
        totalRecords,
        totalPages: totalPages > 0 ? totalPages : 1,
      },
    })
  }

  async show(request: Request, response: Response) {
    const userSchema = z.object({
      role: z.enum(["admin", "member"]),
      teamId: z.string().uuid().optional(),
    })

    const { role, teamId } = userSchema.parse(request.user)

    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const task = await prisma.task.findFirst({
      where: { id },
      include: { team: true, user: true },
    })

    if (!task) {
      throw new AppError("Essa tarefa não existe")
    }

    if (task.teamId !== teamId && role !== "admin") {
      throw new AppError(
        "Essa tarefa não pode ser exibida, pois não pertence a sua equipe"
      )
    }

    return response.json(task)
  }

  async update(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const bodySchema = z.object({
      title: z.string().trim().optional(),
      description: z.string().trim().optional(),
      priority: z.enum(["low", "medium", "high"]).optional(),
      team_id: z.string().uuid().optional(),
      assigned_to: z.string().uuid().nullable().optional(),
    })

    const userSchema = z.object({
      id: z.string().uuid(),
      role: z.enum(["admin", "member"]),
    })

    const { id } = paramsSchema.parse(request.params)
    const { title, description, priority, team_id, assigned_to } =
      bodySchema.parse(request.body)

    const { id: userId, role } = userSchema.parse(request.user)

    const task = await prisma.task.findFirst({ where: { id } })

    if (!task) {
      throw new AppError("Essa tarefa não existe")
    }

    if (task.assignedTo !== userId && role !== "admin") {
      throw new AppError(
        "Edição não autorizada. Você não pode editar tarefa de outros membros.",
        401
      )
    }

    await prisma.task.update({
      data: {
        title,
        description,
        priority,
        teamId: team_id,
        assignedTo: assigned_to,
      },
      where: {
        id,
      },
    })

    return response.json()
  }

  async remove(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const task = await prisma.task.findFirst({ where: { id } })

    if (!task) {
      throw new AppError("Essa tarefa não existe")
    }

    await prisma.task.delete({ where: { id } })

    return response.json()
  }
}
