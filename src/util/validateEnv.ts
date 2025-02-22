import { cleanEnv, str, port } from "envalid"
export default cleanEnv(process.env, {
  MONGO_CONNECTION_STRING: str(),
  PORT: port(),
  SESSION_SECRET: str(),
  JWT_SECRET: str(),
})
