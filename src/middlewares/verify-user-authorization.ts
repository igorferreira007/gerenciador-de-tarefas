import { AppError } from "@/utils/AppError"
import { NextFunction, Request, Response } from "express"

export function verifyUserAuthorization(roles: string[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    if (!request.user) {
      throw new AppError("Usuário não autorizado", 401)
    }

    if (!roles.includes(request.user.role)) {
      throw new AppError("Usuário não autorizado", 401)
    }

    return next()
  }
}