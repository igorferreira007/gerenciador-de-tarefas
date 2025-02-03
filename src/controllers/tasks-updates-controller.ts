import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { Request, Response } from "express"
import z from "zod"

export class TasksUpdatesController {
  async assignedToUpdate(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = paramsSchema.parse(request.params)

    const task = await prisma.task.findFirst({ where: { id: id } })

    if (!task) {
      throw new AppError("Essa tarefa não existe")
    }

    const bodySchema = z.object({
      assigned_to: z.string().uuid()
    })

    const { assigned_to } = bodySchema.parse(request.body)

    const teamMember = await prisma.teamMember.findFirst({ where: { userId: assigned_to } })

    if (!teamMember) {
      throw new AppError("Esse membro não está em nenhuma equipe")
    }

    if (task.teamId !== teamMember.teamId) {
      throw new AppError("Esse membro não pertence a equipe dessa tarefa")
    }

    await prisma.task.update({
      data: {
        assignedTo: assigned_to
      },
      where: {
        id: id
      }
    })

    return response.json()
  }

  async statusUpdate(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().uuid()
    })
    
    const userSchema = z.object({
      id: z.string().uuid(),
      role: z.enum(["admin", "member"])
    })

    const { id } = paramsSchema.parse(request.params)
    const { id: userId, role } = userSchema.parse(request.user)

    const task = await prisma.task.findFirst({ where: { id: id } })

    if (!task) {
      throw new AppError("Essa tarefa não existe")
    }

    if (task.assignedTo !== userId && role !== "admin") {
      throw new AppError("Edição não autorizada. Você não pode editar tarefa de outros membros.", 401)
    }
    
    if (task.status === "completed" && role !== "admin") {
      throw new AppError("A tarefa está com o status de concluída, apenas o administrador pode alterar o status")
    }

    const bodySchema = z.object({
      status: z.enum(["inProgress", "completed"])
    })

    const { status } = bodySchema.parse(request.body)

    if (task.status === status) {
      throw new AppError(`Essa tarefa já está com o status: ${status}`)
    }

    await prisma.task.update({
      data: {
        status
      },
      where: {
        id
      }
    })

    await prisma.taskHistory.create({
      data: {
        taskId: id,
        changedBy: userId,
        oldStatus: task.status,
        newStatus: status
      }
    })

    return response.json()
  }

  async priorityUpdate(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().uuid()
    })
    
    const userSchema = z.object({
      id: z.string().uuid(),
      role: z.enum(["admin", "member"])
    })

    const { id } = paramsSchema.parse(request.params)
    const { id: userId, role } = userSchema.parse(request.user)

    const task = await prisma.task.findFirst({ where: { id: id } })

    if (!task) {
      throw new AppError("Essa tarefa não existe")
    }

    if (task.assignedTo !== userId && role !== "admin") {
      throw new AppError("Edição não autorizada. Você não pode editar tarefa de outros membros.", 401)
    }

    const bodySchema = z.object({
      priority: z.enum(["low", "medium", "high"])
    })

    const { priority } = bodySchema.parse(request.body)

    await prisma.task.update({
      data: {
        priority
      },
      where: {
        id
      }
    })

    return response.json()
  }
}