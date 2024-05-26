import { MovieModel } from '../models/movie.js'
import { validateMovie, validatePartialMovie } from '../schemas/movies.js'

export class MovieController {
  static async getAll (req, res) {
    // agregar el filtrado de peliculas por diferentes params
    const { genre } = req.query
    const movies = await MovieModel.getAll({ genre })
    res.json(movies)
  }

  static async getById (req, res) { // express usar: path-to-regexp es una biblioteca, convierte path a expresiones regulares
    const { id } = req.params
    const movie = await MovieModel.getById({ id })
    return movie
      ? res.json(movie)
      : res.status(404).json({ message: 'Movie not found' })
  }

  static async create (req, res) {
    const result = validateMovie(req.body)
    if (result.error) {
      // aca podemos usar tambien el 422
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const newMovie = await MovieModel.create({ input: result.data })
    res.status(201).json(newMovie)
  }

  static async update (req, res) {
    const result = validatePartialMovie(req.body)
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const { id } = req.params
    const updatedMovie = await MovieModel.update({ id, input: result.data })
    res.json(updatedMovie)
  }

  static async delete (req, res) {
    const { id } = req.params
    const result = await MovieModel.delete({ id })
    if (!result) {
      return res.status(404).json({ message: 'Movie not found' })
    }
    res.json({ message: 'Movie deleted' })
  }
}
