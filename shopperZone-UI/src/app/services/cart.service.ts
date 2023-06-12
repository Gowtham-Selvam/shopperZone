import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems: CartItem[] = [];
  storage: Storage = sessionStorage;

  //Subject - stream of events which emits only latest values to new subscribers
  //ReplaySubject - stream of events which has access to all the previously emitted values as well
  //BehaviorSubject - stream of events with most recent value emitted by the observable

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  constructor() {
    let data = JSON.parse(this.storage.getItem('cartItems')!);

    if (data !== null) {
      this.cartItems = data;

      this.computeCartTotals();
    }
  }

  addToCart(cartItem: CartItem) {
    let alreadyExist: boolean = false;
    let existingCartItem: CartItem = undefined;

    if (this.cartItems.length > 0) {
      existingCartItem = this.cartItems.find((item) => {
        return item.id === cartItem.id;
      });

      alreadyExist = existingCartItem !== undefined;
    }

    if (alreadyExist) existingCartItem.quantity++;
    else this.cartItems.push(cartItem);

    this.computeCartTotals();
  }

  decrementQuantity(item: CartItem) {
    item.quantity--;
    if (item.quantity === 0) this.removeItem(item);
    else this.computeCartTotals();
  }

  removeItem(item: CartItem) {
    const itemIdx = this.cartItems.findIndex((cartItem) => {
      return item.id === cartItem.id;
    });

    if (itemIdx > -1) this.cartItems.splice(itemIdx, 1);
    this.computeCartTotals();
  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;
    this.cartItems.forEach((el) => {
      totalPriceValue += el.price * el.quantity;
      totalQuantityValue += el.quantity;
    });

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
    this.persistCartItems();
  }

  persistCartItems() {
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }
}
