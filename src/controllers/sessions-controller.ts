import { authConfig } from "@/configs/auth"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { compare } from "bcrypt"
import { Request, Response } from "express"
import { sign } from "jsonwebtoken"
import z from "zod"

export class SessionsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string().trim().min(6)
    })

    const { email, password } = bodySchema.parse(request.body)

    const user = await prisma.user.findFirst({ where: { email } })

    if (!user) {
      throw new AppError("Usuário e/ou senha incorreto", 401)
    }

    const correctPassword = await compare(password, user.password)

    if (!correctPassword) {
      throw new AppError("Usuário e/ou senha incorreto", 401)
    }

    const { secret, expiresIn } = authConfig.jwt

    const token = sign({ role: user.role }, secret, {
      subject: user.id,
      expiresIn
    })

    const { password: hashedPassword, ...userWithoutPassword } = user

    return response.status(201).json({ token, user: userWithoutPassword })
  }
}