import type { CartItem } from "@/interfaces";
import Cookies from 'js-cookie'

export class CartCookiesClient {
    static getCart(): CartItem[] {

        const cart = JSON.parse( Cookies.get('cart') || '[]' );
        return cart;
    }

    static addItem( cartiItem: CartItem): CartItem[] {
        
        const cart = CartCookiesClient.getCart();
        const existItemInCart = cart.find( 
            item => item.id === cartiItem.id 
            && item.size === cartiItem.size
        );
        if ( existItemInCart ) {
            existItemInCart.quantity += cartiItem.quantity;
        } else {
            cart.push(cartiItem);
        }
        Cookies.set('cart', JSON.stringify(cart));
        return cart;
    }

    static removeItem( productId: string, size: string ): CartItem[] {
        console.log(productId, size);
        const cart = CartCookiesClient.getCart();

        const updatedCart = cart.filter( 
            item => !(item.id === productId && item.size === size) 
        );
        console.log(updatedCart);
        Cookies.set('cart', JSON.stringify(updatedCart));
        return updatedCart;
    }


}