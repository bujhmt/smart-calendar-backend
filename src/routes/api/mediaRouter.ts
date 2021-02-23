import express from 'express'
import MediaController from '../../controllers/api/media.controller'

export const MediaRouter = express.Router()

MediaRouter.post('/', MediaController.saveMedia)
