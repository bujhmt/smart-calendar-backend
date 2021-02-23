import mongoose from 'mongoose'

export const UserSchema: mongoose.Schema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    intentions: { type: mongoose.Types.ObjectId, ref: 'Intention' },
    avaUrl: { type: String, default: '/default-avatar.jpg' },
    created: { type: Date, default: new Date() },
    fullname: { type: String, required: false },
    telegramId: { type: String, required: false },
})

export interface IUser extends mongoose.Document {
    email: string
    password: string
    avaUrl?: string
    created?: Date
    fullname?: string
    telegramId?: string
}

export default mongoose.model<IUser>('User', UserSchema)
