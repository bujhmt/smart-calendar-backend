require('dotenv').config()

const mode: string = process.env.NODE_ENV || ''

export function isDev(): boolean {
    return mode === 'dev'
}
