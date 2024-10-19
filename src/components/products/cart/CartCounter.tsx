import { itemsInCart } from '@/store';
import { CartCookiesClient } from '@/Utils';
import { useStore } from '@nanostores/react';
import { useEffect } from 'react';


export const CartCounter = () => {

  const $itemsInCart = useStore(itemsInCart);
  
  useEffect(() => {
    const cart = CartCookiesClient.getCart();
    itemsInCart.set(cart.length);
  }, []);

  return (
    <a href="/cart" className="relative inline-block">
      {
        $itemsInCart > 0
        ? <span className="absolute -top2 -right-2 flex justify-center items-center bg-blue-600 text-white text-xs rounded-full w-4 h-4">
            {$itemsInCart}
        </span>
        : null
      }


        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="none" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 21a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3m-8 0a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3M3.71 5.4h15.214c1.378 0 2.373 1.27 1.995 2.548l-1.654 5.6C19.01 14.408 18.196 15 17.27 15H8.112c-.927 0-1.742-.593-1.996-1.452zm0 0L3 3"></path></svg>

    </a>
  )
}
