import { CartItem } from './cart-item';

export class OrderItem {
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  productId: string;

  constructor(cartItem: CartItem) {
    this.imageUrl = cartItem.image;
    this.quantity = cartItem.quantity;
    this.unitPrice = cartItem.price;
    this.productId = cartItem.id;
  }
}
