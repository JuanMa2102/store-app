import { Role, User, db, Product, ProductImage } from 'astro:db';
import { v4 as UUID } from 'uuid';
import bcrypt from 'bcryptjs';
import { seedProducts } from './seed-data';

// https://astro.build/db/seed
export default async function seed() {
  const roles = [
    { id: 'admin', name: 'Administrador' },
    { id: 'user', name: 'Usuario de sistema' },
  ];

  const johnDoe = {
    id: 'abc-123-john', // UUID(),
    name: 'John Doe',
    email: 'john.doe@google.com',
    password: bcrypt.hashSync('123456'),
    role: 'admin',
  };

  const janeDoe = {
    id: 'abc-123-jane', //UUID(),
    name: 'Jane Doe',
    email: 'jane.doe@google.com',
    password: bcrypt.hashSync('123456'),
    role: 'user',
  };

  await db.insert(Role).values(roles);
  await db.insert(User).values([johnDoe, janeDoe]);

  const queries: any = [];

  seedProducts.forEach(p => {

    const product ={
      id: UUID(),
      description: p.description,
      gender: p.gender,
      price: p.price,
      sizes: p.sizes.join(','),
      slug: p.slug,
      stock: p.stock,
      tags: p.tags.join(','),
      title: p.title,
      type: p.type,
      images: p.images,
      user: johnDoe.id
    }

    queries.push(db.insert(Product).values(product));
    p.images.forEach((image: string) => {
        const img = {
            id: UUID(),
            image: image,
            productId: product.id
        }

        queries.push(db.insert(ProductImage).values(img));
    })
  });

  await db.batch(queries);

}