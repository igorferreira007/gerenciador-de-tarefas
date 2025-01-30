import express from "express"
import "express-async-errors"
import { router } from "./routes"
import { errorHandling } from "./middlewares/error-handling"

const PORT = 3333
const app = express()

app.use(express.json())
app.use(router)
app.use(errorHandling)

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))