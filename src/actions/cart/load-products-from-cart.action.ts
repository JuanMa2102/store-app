import type { CartItem } from "@/interfaces";
import { defineAction } from "astro:actions";
import { db, eq, inArray, Product, ProductImage } from "astro:db";
import { z } from "zod";

export const loadProductsFromCart = defineAction({
    accept: 'json',
    handler: async ( { cart }) => {
        const cartItem = JSON.parse( cart || '[]' ) as CartItem[];
        
        if( cartItem.length === 0 ) return [];

        const productIds = cartItem.map( (item) => item.id );
        const dbProducts = await db
        .select()
        .from(Product)
        .innerJoin(ProductImage, eq(ProductImage.productId, Product.id))
        .where( inArray(Product.id, productIds) );

        return cartItem.map((item: any) => {
            const dbProduct = dbProducts.find((p) => p.Product.id === item.id);
            if (!dbProduct) {
              throw new Error(`Product with id ${item.id} not found`);
            }
      
            const { title, price, slug } = dbProduct.Product;
            const image = dbProduct.ProductImage.image;
            return {
              productId: item.id,
              title: title,
              size: item.size,
              quantity: item.quantity,
              image: image.startsWith('http')
                ? image
                : `${import.meta.env.PUBLIC_URL}/images/products/${image}`,
              price: price,
              slug: slug,
            };
          });

    }
})