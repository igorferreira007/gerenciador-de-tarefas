import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { Request, Response } from "express"
import z, { ZodError } from "zod"

import uploadConfig from "@/configs/upload"
import { DiskStorage } from "@/providers/disk-storage"

export class UsersUpdatesController {
  async roleUpdate(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const bodySchema = z.object({
      role: z.enum(["admin", "member"]),
    })

    const { id } = paramsSchema.parse(request.params)

    const user = await prisma.user.findFirst({ where: { id } })

    if (!user) {
      throw new AppError("Esse usuário não existe")
    }

    const { role } = bodySchema.parse(request.body)

    await prisma.user.update({
      data: {
        role,
      },
      where: {
        id,
      },
    })

    return response.json()
  }

  async userAvatarUpdate(request: Request, response: Response) {
    const diskStorage = new DiskStorage()

    try {
      const fileSchema = z
        .object({
          filename: z.string().min(1, "O arquivo é obrigatório."),
          mimetype: z
            .string()
            .refine(
              (type) => uploadConfig.ACCEPTED_IMAGE_TYPES.includes(type),
              `Formato de arquivo inválido. Formatos permitidos: ${uploadConfig.ACCEPTED_IMAGE_TYPES}`
            ),
          size: z
            .number()
            .positive()
            .refine(
              (size) => size <= uploadConfig.MAX_FILE_SIZE,
              `O arquivo excede o tamanho máximo de ${uploadConfig.MAX_SIZE}MB`
            ),
        })
        .passthrough()

      const user_id = request.user?.id
      const file = fileSchema.parse(request.file)
      const filename = await diskStorage.saveFile(file.filename)

      const oldAvatar = await prisma.user.findFirst({
        where: { id: user_id },
      })

      const user = await prisma.user.update({
        where: { id: user_id },
        data: { avatar: filename },
      })

      if (oldAvatar?.avatar) {
        await diskStorage.deleteFile(oldAvatar.avatar, "upload")
      }

      const { password, ...userWithoutPassword } = user

      return response.json(userWithoutPassword)
    } catch (error) {
      if (error instanceof ZodError) {
        if (request.file) {
          await diskStorage.deleteFile(request.file.filename, "tmp")
        }

        throw new AppError(error.issues[0].message)
      }

      throw error
    }
  }
}
