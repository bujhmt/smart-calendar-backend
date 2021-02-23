import { existsSync, mkdirSync, rmdir } from 'fs'
import { emptyDir } from 'fs-extra'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { isDev } from '../utils/dotenv.util'

require('dotenv').config()

const pathToBufferDir: string = path.resolve(
    require.main.filename,
    process.env.PATH_TO_BUFFER || '../'
)

const supportedFileFormats: string[] = process.env.SUPPORTED_FILE_FORMATS
    ? process.env.SUPPORTED_FILE_FORMATS.split(',')
    : []

class MediaRepository {
    constructor() {
        try {
            if (isDev()) console.log('Buffer dir: ', pathToBufferDir)
            if (!existsSync(pathToBufferDir)) {
                mkdirSync(pathToBufferDir)
                if (isDev()) console.log('Created new buffer directory.')
            } else {
                this.clearBufferDirectory()
            }
        } catch (err) {
            console.log('Media Repository create error: ', err.message)
        }
    }
    get path() {
        return pathToBufferDir
    }

    checkFileFormat(format: string) {
        return supportedFileFormats.includes(format)
    }

    getNewId() {
        return uuidv4()
    }

    async clearBufferDirectory() {
        await emptyDir(pathToBufferDir)
        console.log('Buffer has been cleared.')
    }
}

export default MediaRepository
