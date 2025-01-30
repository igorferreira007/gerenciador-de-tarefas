import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { hash } from "bcrypt"
import { NextFunction, Request, Response } from "express"
import { z } from "zod"

export class UsersController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(1),
      email: z.string().trim().email(),
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
}