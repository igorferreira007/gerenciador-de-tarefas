import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { Request, Response } from "express"
import z from "zod"

export class TeamsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(1),
      description: z.string()
    })

    const { name, description } = bodySchema.parse(request.body)

    const teamExists = await prisma.team.findFirst({ where: { name } })

    if (teamExists) {
      throw new AppError("Esse nome de equipe já existe, tente outro nome")
    }

    await prisma.team.create({
      data: {
        name,
        description
      }
    })

    return response.status(201).json()
  }

  async index(request: Request, response: Response) {
    const querySchema = z.object({
      name: z.string().optional(),
      description: z.string().optional()
    })

    const { name, description } = querySchema.parse(request.query)

    const teams = await prisma.team.findMany({ 
      where: {
        name: {
          contains: name,
          mode: "insensitive"
        },
        description: {
          contains: description,
          mode: "insensitive"
        }
      },
      orderBy: { name: "asc" } 
    })

    return response.json(teams)
  }

  async show(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = paramsSchema.parse(request.params)

    const team = await prisma.team.findFirst({ where: { id } })

    if (!team) {
      throw new AppError("Essa equipe não existe")
    }

    return response.json(team)
  }

  async update(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    const bodySchema = z.object({
      name: z.string().trim().min(1).optional(),
      description: z.string().trim().optional()
    })

    const { id } = paramsSchema.parse(request.params)

    const team = await prisma.team.findFirst({ where: { id } })

    if (!team) {
      throw new AppError("Essa equipe não existe")
    }

    const { name, description } = bodySchema.parse(request.body)

    await prisma.team.update({
      where: { id },
      data: {
        name,
        description
      }
    })

    return response.json()
  }

  async remove(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = paramsSchema.parse(request.params)

    const team = await prisma.team.findFirst({ where: { id } })

    if (!team) {
      throw new AppError("Essa equipe não existe")
    }

    await prisma.team.delete({ where: { id } })

    return response.json()
  }
}