import cld from 'cloudinary'

require('dotenv').config()

const cloudinary = cld.v2

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

// File upload
export async function uploadMedia(path: string, options?: {}): Promise<string> {
    const response = await cloudinary.uploader.upload(path, options)
    return response.url
}
