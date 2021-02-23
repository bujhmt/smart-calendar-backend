import mongoose, { Types } from 'mongoose'

export const IntentionSchema: mongoose.Schema = new mongoose.Schema({
    date: { type: String, required: true },
    owner: { type: String, ref: 'User' },
    importance: { type: Number, default: 5 },
    time: { type: String },
    tags: { type: Array, default: [] },
    fileLinks: { type: Array, default: [] },
    title: { type: String },
    description: { type: String },
})

export interface IIntention extends mongoose.Document {
    date: String
    owner: string
    importance: number
    time: String
    tags: Array<string>
    fileLinks: Array<string>
    title: string
    description: string
}

export default mongoose.model<IIntention>('Intention', IntentionSchema)
