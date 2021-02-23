import { Router } from 'express'
import checkAuth from '../../middleware/auth.middleware'

import UserController from '../../controllers/api/user.controller'

const UserRouter: Router = Router()

UserRouter.get('/', checkAuth, UserController.getUserData)
UserRouter.put('/update', checkAuth, UserController.updateUserData)

export default UserRouter
