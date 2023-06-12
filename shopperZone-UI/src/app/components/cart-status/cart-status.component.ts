import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.scss'],
})
export class CartStatusComponent implements OnInit {
  itemQuantity: number = 0;
  cartAmount: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.totalPrice.subscribe((price) => {
      this.cartAmount = price;
    });
    this.cartService.totalQuantity.subscribe((quantity) => {
      this.itemQuantity = quantity;
    });
  }
}
