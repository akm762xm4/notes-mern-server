import express, { NextFunction, Request, Response } from "express"
import notesRoutes from "./routes/NotesRoutes"
import userRoutes from "./routes/UsersRoutes"
import { requiresAuth } from "./middlewares/requiresAuth"
import morgan from "morgan"
import cors from "cors"
import createHttpError, { isHttpError } from "http-errors"

const corsOptions = {
  origin: "*",
  credentials: true,
}

const app = express()

app.use(cors(corsOptions))

app.use(morgan("dev"))

app.use(express.json())

app.use("/api/notes", requiresAuth, notesRoutes)
app.use("/api/users", userRoutes)

app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not Found !"))
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error)
  let errorMessage = "An unknown Error Occurred!"
  let statusCode = 500
  if (isHttpError(error)) {
    statusCode = error.status
    errorMessage = error.message
  }
  res.status(statusCode).json({ error: errorMessage })
})

export default app
