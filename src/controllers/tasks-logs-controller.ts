import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { Request, Response } from "express"
import z from "zod"

export class TasksLogsController {
  async index(request: Request, response: Response) {
    const querySchema = z.object({
      taskId: z.string().uuid().optional()
    })

    const userSchema = z.object({
      role: z.enum(["admin", "member"]),
      teamId: z.string().uuid().optional()
    })

    const { taskId } = querySchema.parse(request.query)
    const { role, teamId } = userSchema.parse(request.user)
    
    const taskHistory = await prisma.taskHistory.findMany({
      where: {
        taskId: {
          contains: taskId?.toString().trim(),
          mode: "insensitive"
        }
      },
      include: {
        user: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        changedAt: "desc"
      }
    })

    if (role !== "admin") {
      const tasks = await prisma.task.findMany({ where: { teamId } })

      const taskId = tasks.map(task => task.id)

      const teamTaskHistories = taskHistory.filter(taskHistory => taskId.includes(taskHistory.taskId))

      return response.json(teamTaskHistories)
    }

    return response.json(taskHistory)
  }
}