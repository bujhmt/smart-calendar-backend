import { Router } from 'express'
import { check } from 'express-validator/check'
import checkAuth from '../../middleware/auth.middleware'

import IntentionController from '../../controllers/api/intention.controller'

const IntentionRouter: Router = Router()

IntentionRouter.post(
    '/create',
    checkAuth,
    [check('date', 'Incorrect date format').exists(), check('title', 'Incorrect title').exists()],
    IntentionController.create
)

IntentionRouter.get('/', checkAuth, IntentionController.getUserIntentions)

IntentionRouter.delete('/:id', checkAuth, IntentionController.deleteById)

export default IntentionRouter
