import { prisma } from "@/database/prisma"
import bcrypt from "bcrypt"

async function main() {
  const adminEmail = "admin@email.com"

  // Verifica se o admin já existe
  const adminExists = await prisma.user.findFirst({
    where: { email: adminEmail },
  })

  if (!adminExists) {
    console.log("Criando usuário admin...")

    const hashedPassword = await bcrypt.hash("123456", 8)

    await prisma.user.create({
      data: {
        name: "Administrador",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      },
    })

    console.log("Usuário admin criado!")
  } else {
    console.log("Usuário admin já existe. Nenhuma ação necessária.")
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
