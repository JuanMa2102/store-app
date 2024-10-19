import type { ProductWithImages } from "@/interfaces";
import { ProductCard } from "./ProductCard";
interface Props {
    prducts: ProductWithImages[]
}

export const ProductList = ({prducts}: Props) => {
  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 place-items-center"

    >{
        prducts.map(product => (
            <ProductCard key={product.id} product={product} />
        ))
    }
    </div>
  )
}
