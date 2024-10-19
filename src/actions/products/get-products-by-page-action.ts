import type { ProductWithImages } from "@/interfaces/products-with-images-interface";
import { defineAction } from "astro:actions";
import { ProductImage, sql } from "astro:db";
import { db, eq, Product } from "astro:db";
import { count } from "astro:db";
import { z } from "zod";

export const getProductsByPage = defineAction({
    accept: 'json',
    input: z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).default(10),    
    }),
    handler: async ({ page, limit }, { cookies }) => {
        page = page <= 0 ? 1 : page;

        const [totalRecords] = await db.select({
            count: count()
        }).from(Product);

        const totalPages = Math.ceil(totalRecords.count / limit);

        if (page > totalPages) {
            return {
                products: [] as ProductWithImages[],
                totalPages: totalPages,
            }
        }
        // const products = await db
        // .select()
        // .from(Product)
        // .innerJoin(ProductImage, eq(ProductImage.productId, Product.id))
        // .limit(limit)
        // .offset((page - 1) * 12);
        const productQuery = sql`
            select a.*,
            ( select GROUP_CONCAT(image,',') from 
                ( select * from ${ProductImage} where productId = a.id limit 2 )
            ) as images
            from ${Product} a
            LIMIT ${limit} OFFSET ${(page - 1) * limit}
        `;
        const { rows } = await db.run(productQuery);

        const products = rows.map((product: any) => {
            return {
                ...product,
                images: product.images ? product.images: 'no-image.png',
            }
        })

        // console.log(rows)
        return {
            products: products as unknown as ProductWithImages[],
            totalPages: totalPages,
        } 
    }
})