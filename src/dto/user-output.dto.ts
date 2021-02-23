import { IUser } from '../models/user.entity'

export default class UserOutputDto {
    constructor(user: IUser) {
        this.avaUrl = user.avaUrl
        this.created = user.created
        this.fullname = user.fullname
        this.email = user.email
    }

    avaUrl?: string
    created?: Date
    fullname?: string
    email: string
}
