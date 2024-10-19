import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
    cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME, 
    api_key: import.meta.env.CLOUDINARY_API_KEY,
    api_secret: import.meta.env.CLOUDINARY_API_SECRET
});

export class ImageUpload {
    static async uploadImage( file: File) {

        const buffer = await file.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const imageType = file.type.split('/')[1];

        const resp = await cloudinary.uploader.upload(
            `data:image/${imageType};base64,${base64}`,
        );

        return resp.secure_url;
    }

    static async delete( image: string) {
        try {
            const imageName = image.split('/').pop() || '';
            const imageId = imageName.split('.')[0];
            await cloudinary.uploader.destroy(imageId);
            return true;
        }
        catch (error) {
            return false;
        }
    }
}