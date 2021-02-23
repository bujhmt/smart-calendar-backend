import express from 'express'
import validator from 'express-validator/check'
import { IUserReq } from '../../middleware/auth.middleware'
import Intention, { IIntention } from '../../models/intention.entity'

export default {
    async create(req: express.Request & IUserReq, res: express.Response) {
        try {
            const validationErrors: validator.Result = validator.validationResult(req)

            if (!validationErrors.isEmpty()) {
                return res.status(400).send({
                    errors: validationErrors.array(),
                    message: 'Incorrect data',
                })
            }
            req.body.owner = req.user.userId
            const newIntention: IIntention = new Intention(req.body)
            await newIntention.save()

            res.status(201).send({ message: 'Intention has been created!' })
        } catch (err) {
            console.log('Intention/create Error! ', err.message)
            res.status(500).send({ message: 'Internal server error' })
        }
    },

    async getUserIntentions(req: express.Request & IUserReq, res: express.Response) {
        try {
            const userId: string = String(req.user.userId)

            const userIntentions: IIntention[] = await Intention.find({ owner: userId })

            res.status(200).send({ intentions: userIntentions })
        } catch (err) {
            console.log('Intention/getAll Error! ', err.message)
            res.status(500).send({ message: 'Internal server error' })
        }
    },

    async deleteById(req: express.Request & IUserReq, res: express.Response) {
        try {
            if (!req.params.id) {
                return res.status(400).send({ message: 'Bad request' })
            }
            const intentionId: string = String(req.params.id)

            if (!(await Intention.exists({ _id: intentionId }))) {
                return res.status(404).send({ message: 'Not found' })
            }

            await Intention.deleteOne({ _id: intentionId })

            res.status(200).send({ message: 'Intention was successfully deleted' })
        } catch (err) {
            console.log('Intention/deleteById Error! ', err.message)
            res.status(500).send({ message: 'Internal server error' })
        }
    },
}
