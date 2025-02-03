import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { hash } from "bcrypt"
import { NextFunction, Request, Response } from "express"
import { z } from "zod"

export class UsersController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(1),
      email: z.string().email(),
      password: z.string().trim().min(6)
    })
    
    const { name, email, password } = bodySchema.parse(request.body)

    const userExists = await prisma.user.findFirst({ where: { email } })

    if (userExists) {
      throw new AppError("Esse usuário já existe")
    }

    const hashedPassword = await hash(password, 8)

    await prisma.user.create({
      data: { name, email, password: hashedPassword }
    })
    
    return response.status(201).json()
  }

  async index(request: Request, response: Response) {
    const querySchema = z.object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      role: z.enum(["admin", "member"]).optional()
    })

    const { name, email, role } = querySchema.parse(request.query)

    const users = await prisma.user.findMany({
      where: {
        name: {
          contains: name?.toString().trim(),
          mode: "insensitive"
        },
        email: {
          contains: email?.toString().trim(),
          mode: "insensitive"
        },
        role: {
          equals: role
        }
      },
      orderBy: {
        name: "asc"
      }
    })

    const usersWithoutPassword = users.map(user => {
      const { password, ...otherUserProps } = user
      
      return otherUserProps
    })

    return response.json(usersWithoutPassword)
  }

  async show(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = paramsSchema.parse(request.params)

    const user = await prisma.user.findFirst({ where: { id } })

    if (!user) {
      throw new AppError("Esse usuário não existe")
    }

    const { password, ...userWithoutPassword } = user

    return response.json(userWithoutPassword)
  }

  async update(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    const bodySchema = z.object({
      name: z.string().trim().min(1).optional(),
      email: z.string().email().optional(),
      password: z.string().trim().min(6).optional(),
      role: z.enum(["admin", "member"]).optional()
    })

    const { id } = paramsSchema.parse(request.params)
    
    const user = await prisma.user.findFirst({ where: { id } })
    
    if (!user) {
      throw new AppError("Esse usuário não existe")
    }

    const { name, email, password, role } = bodySchema.parse(request.body)

    let hashedPassword

    if (password) {
      hashedPassword = await hash(password, 8)
    }
    
    await prisma.user.update({
      data: {
        name,
        email,
        password: hashedPassword,
        role
      },
      where: {
        id
      }
    })

    return response.json()
  }

  async remove(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = paramsSchema.parse(request.params)
    
    const user = await prisma.user.findFirst({ where: { id } })
    
    if (!user) {
      throw new AppError("Esse usuário não existe")
    }

    await prisma.user.delete({ where: { id } })

    return response.json()
  }
}