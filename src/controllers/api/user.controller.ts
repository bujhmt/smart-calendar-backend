import { Request, Response } from 'express'
import { IUserReq } from '../../middleware/auth.middleware'
import { IUser } from '../../models/user.entity'
import UserOutputDto from '../../dto/user-output.dto'
import UserRepository from '../../repositories/user.repository'
import { customValidate } from '../../utils/validator.util'
import UserInputDto from '../../dto/user-input.dto'

const UserRepo = new UserRepository()

export default {
    async getUserData(req: Request & IUserReq, res: Response) {
        try {
            const user: IUser = await UserRepo.getUserById(req.user.userId as string)
            const outputUserDto = new UserOutputDto(user)
            res.status(200).send({ user: outputUserDto })
        } catch (err) {
            console.log('Users/getUserData Error! ', err.message)
            res.status(500).send({ message: 'Internal server error' })
        }
    },

    async updateUserData(req: Request & IUserReq, res: Response) {
        try {
            const userInputDto: UserInputDto = req.body
            const validationResults = await customValidate(userInputDto)
            if (validationResults.length)
                return res.status(400).send({ message: validationResults.join(', ') })

            const updatedUser: IUser = await UserRepo.updateUserData(
                userInputDto,
                req.user.userId as string
            )
            return res.status(200).send({ message: 'User has been updated', user: updatedUser })
        } catch (err) {
            console.log('Users/updateUserData Error! ', err.message)
            res.status(500).send({ message: 'Internal server error' })
        }
    },
}
