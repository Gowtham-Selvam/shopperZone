import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Purchase } from '../common/purchase';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaymentInfo } from '../common/payment-info';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  constructor(private httpClient: HttpClient) {}

  endPoint = environment.shopperZone;

  paymentUrl = environment.shopperZone + '/checkout/payment-intent';

  placeOrder(purchase: Purchase): Observable<any> {
    const baseUrl = this.endPoint + '/checkout/purchase';
    return this.httpClient.post(baseUrl, purchase);
  }

  createPaymentIntent(paymentInfo: PaymentInfo): Observable<any> {
    return this.httpClient.post<PaymentInfo>(this.paymentUrl, paymentInfo);
  }
}
