import { defineAction } from "astro:actions";
import { z } from "zod";
import { db, Product, eq, ProductImage } from 'astro:db';
import { getSession } from "auth-astro/server";
import { v4 as uuid } from "uuid";
import { ImageUpload } from "@/Utils/image-upload";

const MAX_FILES_SIZE = 5_000_000;
const ACEPTED_IMAGES_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
];

export const createUpdateProduct = defineAction({
    accept: 'form',
    input: z.object({
        id: z.string().optional(),
        description: z.string(),
        gender: z.string(),
        price: z.number(),
        sizes: z.string(),
        slug: z.string(),
        stock: z.number(),
        tags: z.string(),
        title: z.string(),
        type: z.string(),
        imageFiles: z.array( 
            z.instanceof( File )
            .refine( file => file.size <= MAX_FILES_SIZE, 'El tamaño maximo es de 5MB')
            .refine( file => ACEPTED_IMAGES_TYPES.includes(file.type), 'Formato no aceptado')
         ).optional(),    
    }),
    handler: async ( form, { request } ) => {
        
        const session = await getSession( request );
        const user = session?.user;

        if( !user ) {
            throw new Error('User not found');
        }

        const {id=uuid(), imageFiles, ...rest} = form;

        rest.slug = rest.slug.toLowerCase().replaceAll(' ', '-').trim();
        
        const product = {
            id: id,
            user: user.id!,
            ...rest,
        };
        

        const querys: any = [];


        if( !form.id ) {
            querys.push(
                db.insert(Product).values(product),
            )
        }else{
            querys.push(
                db.update(Product).set(product).where(eq(Product.id, form.id)),
            )
        }
        
        let secureUrls: string[] = [];
        if( 
            form.imageFiles && 
            form.imageFiles.length > 0 && 
            form.imageFiles[0].size > 0 ) {
        
            const urls = await Promise.all(
                form.imageFiles.map( (file) => ImageUpload.uploadImage(file) )
            );

            secureUrls.push(...urls);
        }

        secureUrls.forEach( imageUrl => {
            const imageObj = {
                id: uuid(),
                productId: product.id,
                image: imageUrl
            }

            querys.push(
                db.insert(ProductImage).values(imageObj)
            )
        });

        await db.batch( querys );

        return product;
    }
})