import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderHistoryService {
  endPoint = environment.shopperZone;

  private orderUrl = this.endPoint + '/orders/search/';

  constructor(private httpClient: HttpClient) {}

  getOrderHistory(email: string): Observable<ResponseOrderHistory> {
    const baseUrl = this.orderUrl + `findByCustomerEmail?email=${email}`;

    return this.httpClient
      .get<ResponseOrderHistory>(baseUrl)
      .pipe(map((response) => response));
  }
}

interface ResponseOrderHistory {
  _embedded: {
    orders: OrderHistory[];
  };
}
