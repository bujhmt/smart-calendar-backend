import { Router } from 'express'
import AuthRouter from './auth/auth.router'
import IntentionRouter from './intention.router'
import UserRouter from './user.router'
import {MediaRouter} from "./mediaRouter";

const ApiRouter: Router = Router()

ApiRouter.use('/auth', AuthRouter)
ApiRouter.use('/intentions', IntentionRouter)
ApiRouter.use('/users', UserRouter)
ApiRouter.use('/media', MediaRouter)

export default ApiRouter
