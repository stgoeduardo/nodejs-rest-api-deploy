import { Router } from 'express'
import { MovieController } from '../controllers/movies.js'

export const moviesRouter = Router()

// GET /movies/
moviesRouter.get('/', MovieController.getAll)
// GET /movies/:id
moviesRouter.get('/:id', MovieController.getById)
// POST /movies/
moviesRouter.post('/', MovieController.create)
// PATCH /movies/:id
moviesRouter.patch('/:id', MovieController.update)
// DELETE /movies/:id
moviesRouter.delete('/:id', MovieController.delete)
