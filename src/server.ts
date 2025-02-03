import express from "express"
import "express-async-errors"
import { router } from "./routes"
import { errorHandling } from "./middlewares/error-handling"
import { env } from "./env"

const PORT = env.PORT
const app = express()

app.use(express.json())
app.use(router)
app.use(errorHandling)

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))