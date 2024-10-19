import { defineAction } from "astro:actions";
import { z } from "zod";
import { db, Product, eq, ProductImage } from 'astro:db';


const newProduct = {
    id: '',
    description: 'Nuevo producto',
    gender: 'men',
    price: 100,
    sizes: 'XS,S,M',
    slug: 'nuevo-producto',
    stock: 0,
    tags: 'shirt, men',
    title: 'Nuevo Producto',
    type: 'shirts',
}

export const getProductsBySlug = defineAction({
    accept: 'json',
    input: z.string(),
    handler: async ( slug ) => {

        if( slug === 'new' ) {
            return {
                product: newProduct,
                images: []
            }
        }

        const [product] = await db
            .select()
            .from(Product)
            .where(eq(Product.slug, slug));

        if( !product ) {
            throw new Error('Product not found');
        }

        const images = await db
            .select()
            .from(ProductImage)
            .where(eq(ProductImage.productId, product.id))

        return { 
            product, 
            // images: images.map(image => image.image)
            images: images
        };
    }
})