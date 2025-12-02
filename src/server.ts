import express from "express"
import cors from "cors"
import "express-async-errors"
import { router } from "./routes"
import { errorHandling } from "./middlewares/error-handling"
import { env } from "./env"
import uploadConfig from "./configs/upload"

const PORT = env.PORT
const app = express()

const allowedOrigins = [
  "http://localhost:5173",
  "https://taskger.vercel.app",
  "https://taskger-8nkzcl15p-igors-projects-cf0d5339.vercel.app",
]

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true,
  })
)
app.use(express.json())
app.use("/uploads", express.static(uploadConfig.UPLOADS_FOLDER))
app.use(router)
app.use(errorHandling)

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
