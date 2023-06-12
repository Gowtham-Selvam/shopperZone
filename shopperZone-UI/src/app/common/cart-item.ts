import { Product } from './product';

export class CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;

  constructor(product: Product) {
    this.id = product.id;
    this.name = product.name;
    this.image = product.imageUrl;
    this.price = product.unitPrice;
    this.quantity = 1;
  }
}
