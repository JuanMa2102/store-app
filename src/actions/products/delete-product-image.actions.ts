
import { ImageUpload } from '@/Utils/image-upload';
import { defineAction } from 'astro:actions';
import { db, eq, ProductImage } from 'astro:db';
import { getSession } from 'auth-astro/server';
import { z } from 'zod';

export const deleteProductImage = defineAction({
    accept: 'json',
    input: z.string(),
    handler: async ( imageId, {request} ) => {
        
        const session = await getSession( request );
        const user = session?.user;

        if( !user || user.role !== 'admin' ) {
            throw new Error('User not autorized');
        }
        
        const [ productImage ] = await db.select().from(ProductImage).where(eq(ProductImage.id, imageId));
        
        if( !productImage ) {
            throw new Error('Product image not found');
        }

        const deleted = await db.delete( ProductImage )
        .where( eq(ProductImage.id, imageId ) )
    
        if( productImage.image.includes('http') ) {
            await ImageUpload.delete( productImage.image );
        }

        return {
            ok: true
        }
    }
});

/*


import { defineAction } from 'astro:actions';
import { z } from 'zod';

export const deleteProductImage = defineAction({
    accept: 'json',
    input: z.string(),
    handler: async ( imageId ) => {
        return ;
    }
});

*/