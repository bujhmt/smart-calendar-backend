import { S_IRGRP } from 'constants'
import mongoose from 'mongoose'

export const SessionSchema: mongoose.Schema = new mongoose.Schema({
    userId: { type: String, ref: 'User' },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    accessExpires: { type: Number },
    fingerprint: { type: String },
})

export interface ISession extends mongoose.Document {
    userId: string
    accessToken: string
    refreshToken: string
    accessExpires: number
    fingerprint: string
}

export default mongoose.model<ISession>('Session', SessionSchema)
