import type { ProductWithImages } from "@/interfaces"
import { useState } from "react"

interface Props {
    product: ProductWithImages
}
export const ProductCard = ({product} : Props) => {
    const images = product.images.split(",").map(image => {
        return image.startsWith("http") 
        ? image 
        : `${import.meta.env.PUBLIC_URL}/images/products/${image}`
    })

    const [currentImage, setcurrentImage] = useState(images[0])

  return (
    <div>
        <a href={`/products/${product.slug}`}>
            <img 
                src={currentImage}
                alt={product.title} 
                className="h-[350px] object-contain"
                onMouseEnter={() => setcurrentImage(images[1] || images[0])}
                onMouseLeave={() => setcurrentImage(images[0])}
            />
            <h4>{product.title}</h4>
            <p>${product.price}</p>
        </a>
    </div>
  )
}
