import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { NextFunction, Request, Response } from "express"

export async function checkUserTeam(request: Request, response: Response, next: NextFunction) {
  if (!request.user) {
    throw new AppError("JWT não informado")
  }

  const { id: userId, role } = request.user

  const teamMember = await prisma.teamMember.findFirst({ where:{ userId } })

  if (role !== "admin" && !teamMember) {
    throw new AppError("Você não poderá ver/editar nenhuma tarefa, pois não participa de nenhuma equipe")
  }

  if (teamMember) {
    request.user.teamId = teamMember.teamId
  }

  return next()
}