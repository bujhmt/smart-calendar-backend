import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User, { IUser } from '../../models/user.entity'
import Session, { ISession } from '../../models/session.entity'
import TokensRefreshDTO from '../../dto/refresh-tokens.dto'
import AuthDTO from '../../dto/auth.dto'
import { customValidate } from '../../utils/validator.util'

require('dotenv').config()

const expiresAtMinutes = Number(process.env.EXPIRES_TIME_RANGE)

function getExpiresAt(): number {
    return new Date().setMinutes(new Date().getMinutes() + expiresAtMinutes).valueOf()
}

async function makeSession(userId: string, fingerprint: string): Promise<ISession> {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_SECRET, {
        expiresIn: expiresAtMinutes * 60,
    })
    const refreshToken = jwt.sign({ userId, fingerprint }, process.env.REFRESH_SECRET, {
        expiresIn: '60d',
    })
    const session = new Session({
        userId,
        accessToken,
        refreshToken,
        fingerprint,
        accessExpires: getExpiresAt(),
    } as ISession)

    return await session.save()
}

async function removeSessions(userId: string, fingerprint: string): Promise<boolean> {
    const result = await Session.deleteMany({ userId, fingerprint })
    return !!result.deletedCount
}

export default {
    async signUp(req: Request, res: Response) {
        try {
            const newUser: AuthDTO = req.body
            const validationResults = await customValidate(newUser)
            if (validationResults.length)
                return res.status(400).send({ message: validationResults.join(', ') })

            const candidate: IUser = await User.findOne({ email: newUser.email })
            if (candidate) {
                return res.status(400).send({ message: 'This user already exists' })
            }

            newUser.password = await bcrypt.hash(
                newUser.password,
                Number(process.env.PSWD_SALT_ROUNDS)
            )

            const user: IUser = new User(newUser as IUser)
            await user.save()

            res.status(201).send({ message: 'User has been created' })
        } catch (err) {
            console.log('Auth/signUp Error! ', err.message)
            res.status(500).send({ message: 'Internal server error' })
        }
    },

    async login(req: Request, res: Response) {
        try {
            const newUser: AuthDTO = req.body
            const validationResults = await customValidate(newUser)
            if (validationResults.length)
                return res.status(400).send({ message: validationResults.join(', ') })

            const user: IUser = await User.findOne({ email: newUser.email })
            if (!user) {
                return res.status(404).send({ message: 'User not found' })
            }

            const isMatch: boolean = await bcrypt.compare(newUser.password, user.password)

            if (!isMatch) {
                return res.status(400).send({ message: 'Incorrect password' })
            }

            const fingerprint: string = String(req.body.fingerprint)
            await removeSessions(user.id, fingerprint)
            const session: ISession = await makeSession(user.id, fingerprint)

            res.status(200).send({
                refreshToken: session.refreshToken,
                accessToken: session.accessToken,
                expiresAt: session.accessExpires,
            })
        } catch (err) {
            console.log('Auth/login Error! ', err.message)
            res.status(500).send({ message: 'Internal server error' })
        }
    },

    async token(req: Request, res: Response) {
        try {
            console.log(req.body)
            const refreshTokensDTO: TokensRefreshDTO = req.body
            const validationResults = await customValidate(refreshTokensDTO)
            if (validationResults.length)
                return res.status(400).send({ message: validationResults.join(', ') })

            const session: ISession = await Session.findOne({
                refreshToken: refreshTokensDTO.refreshToken,
                fingerprint: refreshTokensDTO.fingerprint,
            })

            session.accessToken = jwt.sign({ userId: session.userId }, process.env.ACCESS_SECRET, {
                expiresIn: expiresAtMinutes * 60,
            })
            session.accessExpires = getExpiresAt()

            res.status(200).send({
                refreshToken: session.refreshToken,
                accessToken: session.accessToken,
                expiresAt: session.accessExpires,
            })
        } catch (err) {
            console.log('Auth/token Error! ', err)
            res.status(500).send({ message: 'Internal server error' })
        }
    },
}
