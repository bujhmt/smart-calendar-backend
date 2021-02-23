import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

require('dotenv').config()

interface JWTAuth {
    userId: string | object
}

export interface IUserReq {
    user: JWTAuth
}

export default async function checkAuth(
    req: Request & IUserReq,
    res: Response,
    next: NextFunction
) {
    try {
        if (req.method === 'OPTIONS') return next()

        const token: string = req.headers.authorization.split(' ')[1]

        if (!token) return res.status(401).send({ message: 'No access' })

        const decoded = jwt.verify(token, process.env.ACCESS_SECRET)
        req.user = decoded as JWTAuth
        next()
    } catch (err) {
        res.status(401).send({ message: 'No access' })
    }
}
