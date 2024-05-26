import express, { json } from 'express'
import { moviesRouter } from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'
// lo que hace resolver es intentar diferentes salidas para la ruta hasta que lo encuentra...pero en ESModules si le debemos poner la extension
const PORT = process.env.PORT ?? 3000
const app = express()

app.use(json())// para hacer el uso de json en los req.body
app.use(corsMiddleware())
app.disable('x-powered-by')// desahbilitar el header X-Powered-By: Express

// Rutas
app.get('/', (req, res) => {
  res.json({ message: 'Dani Server is alive v2.0!' })
})
// Rutas
app.use('/movies', moviesRouter)

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
