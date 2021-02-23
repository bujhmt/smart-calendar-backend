import { Router } from 'express'
import AuthController from '../../../controllers/api/auth.controller'

const AuthRouter: Router = Router()

AuthRouter.post('/signup', AuthController.signUp)

AuthRouter.post('/login', AuthController.login)

AuthRouter.post('/token', AuthController.token)

export default AuthRouter
