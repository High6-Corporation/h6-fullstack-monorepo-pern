import { app } from "./app.js"

const PORT = Number(process.env.PORT ?? process.env.API_PORT ?? 3001)
const HOST = "0.0.0.0"

app.listen(PORT, HOST, () => {
  // eslint-disable-next-line no-console
  console.log(`[api] listening on http://${HOST}:${PORT}`)
})
