import express from "express"
import cors from "cors"
import "express-async-errors"
import { router } from "./routes"
import { errorHandling } from "./middlewares/error-handling"
import { env } from "./env"
import uploadConfig from "./configs/upload"

const PORT = env.PORT
const app = express()

app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use(express.json())
app.use("/uploads", express.static(uploadConfig.UPLOADS_FOLDER))
app.use(router)
app.use(errorHandling)

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
