import express from 'express'
import multer from 'multer'
import MediaRepository from '../../repositories/media.repository'
import { uploadMedia } from '../../utils/cloudinary.util'

const mediaRepository = new MediaRepository()

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, mediaRepository.path)
        },
        filename: (req, file, cb) => {
            const fileFormat = file.mimetype.split('/')[1]
            cb(null, `${mediaRepository.getNewId()}.${fileFormat}`)
        },
    }),

    fileFilter: (req, file, cb) => {
        const fileFormat: string = file.mimetype.split('/')[1]
        if (mediaRepository.checkFileFormat(fileFormat)) {
            cb(null, true)
        } else {
            cb(null, false)
        }
    },
}).any()

export default {
    async saveMedia(req: express.Request, res: express.Response) {
        try {
            upload(req, res, async (err) => {
                if (err) {
                    throw new Error(err.message)
                } else if (req.files) {
                    const url = await uploadMedia(
                        mediaRepository.path + '/' + req.files[0].filename
                    )
                    mediaRepository.clearBufferDirectory()
                    res.status(201).send({ url, message: 'Media has been uploaded' })
                } else {
                    res.status(400).send({ message: 'Bad request' })
                }
            })
        } catch (err) {
            console.log('MediaController/saveMedia Error:', err.message)
            res.status(500).send({ message: 'Internal Server Error ' })
        }
    },
}
