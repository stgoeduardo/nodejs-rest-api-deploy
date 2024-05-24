const express = require('express')
const crypto = require('node:crypto')
const cors = require('cors')
const movies = require('./movies.json')
const { validateMovie, validatePartialMovie } = require('./schemas/movies')
const PORT = process.env.PORT ?? 3000
const ACCEPTED_ORIGINS = [
  'http://localhost:8080',
  'http://localhost:5500',
  'http://localhost:3000',
  'http://localhost:1234',
  'http://localhost:4200',
  'http://127.0.0.1:8080',
  'http://127.0.0.1:5500',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:1234',
  'http://127.0.0.1:4200',
  'https://movies.com'
]
const app = express()
/**
 * Tambien podemos utilizar una libreria de middleware de cors para hacer todo esto mas rapido
 * pero cuidado con eso ya que, al usarlo:
 * app.use(cors()) le damos permiso a todo, es como si a todas las cabeceras se les pone *
 * y no es asi, los temas de seguridad estaroan valiendo madre con eso, hay que tambien entender eso
 * lo que midudev, nos muestra en el video, haciendo esto de cors a mano es para enteder
 * lo importante q eues esto del cors....
 * para probar podemos instalar el cors asi: npm i cors -E, y para usarlo, comentaremos
 * todo lo que hicimos de cors (la logica y el app.options) para ver las diferencias
 */

app.use(express.json())// para hacer el uso de json en los req.body
app.use(cors({
  origin: (origin, callback) => {
    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }
    if (!origin) {
      return callback(null, true)
    }
    return callback(new Error('Not allowed by CORS'))
  }
}))
app.disable('x-powered-by')// desahbilitar el header X-Powered-By: Express

app.get('/', (req, res) => {
  res.json({ message: 'Dani Server is alive!' })
})

app.get('/movies', (req, res) => {
  // resolviendo desde GET /movies el tema de CORS, el detalle es que le pusimos * que es un para todos los dominios...
  // res.header('Access-Control-Allow-Origin', '*')
  // tambien podemos, en lugar de usar el para todo *, indicar la url de donde hare la consulta
  // res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5500')

  /*
  // comentamos esto para usar la biblioteca de cors (es un middleware), en el momento
  // que no usemos el cors, habilitamos esto

  // haremos un ejemplo usando un array de origenes permitidos
  const origin = req.header('origin')
  if (ACCEPTED_ORIGINS.includes(origin) || !origin) { // el !origin significa que no tiene origen
    res.header('Access-Control-Allow-Origin', origin)
  }
  */
  // agregar el filtrado de peliculas por diferentes params
  const { genre } = req.query
  if (genre) {
    const filterdMovies = movies.filter(
      movie => movie.genre.some(m => m.toLowerCase() === genre.toLowerCase())
    )
    return res.json(filterdMovies)
  }
  res.json(movies)
})

/**
 * Supongamos que tenemos esta url:
 * /movies/:id/:mas/:otro
 * Entonces, para recuperar params de la url lo haremos asi
 * const { id, mas, otro } = req.params
 */
app.get('/movies/:id', (req, res) => { // express usar: path-to-regexp es una biblioteca, convierte path a expresiones regulares
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
  return movie
    ? res.json(movie)
    : res.status(404).json({ message: 'Movie not found' })
})

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)
  if (result.error) {
    // aca podemos usar tambien el 422
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }
  const newMovie = {
    id: crypto.randomUUID(), // esto nos crea un uuid v4
    ...result
  }
  // esto no seria REST porque estamos guardando el estado de la aplicacion
  // en memoria, esto cambiaria al momento de usar la BD
  movies.push(newMovie)
  // devolver que se creo correctamente la peli
  res.status(201).json(newMovie)
})

app.delete('/movies/:id', (req, res) => {
  /*
  // comentamos esto para usar la biblioteca de cors (es un middleware), en el momento
  // que no usemos el cors, habilitamos esto
  const origin = req.header('origin')
  if (ACCEPTED_ORIGINS.includes(origin) || !origin) { // el !origin significa que no tiene origen
    res.header('Access-Control-Allow-Origin', origin)
  }
  */
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)
  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }
  movies.splice(movieIndex, 1)

  res.json({ message: 'Movie deleted' })
})

app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body)
  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)
  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }
  const updateMovie = {
    ...movies[movieIndex],
    ...result.data
  }
  movies[movieIndex] = updateMovie
  res.json(updateMovie)
})

/*
// comentamos esto para usar la biblioteca de cors (es un middleware), en el momento
// que no usemos el cors, habilitamos esto
app.options('/movies/:id', (req, res) => {
  const origin = req.header('origin')
  if (ACCEPTED_ORIGINS.includes(origin) || !origin) { // el !origin significa que no tiene origen
    res.header('Access-Control-Allow-Origin', origin)
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
  }
  res.send(200)
})
*/

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
