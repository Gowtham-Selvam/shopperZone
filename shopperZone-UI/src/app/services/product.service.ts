import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  endPoint = environment.shopperZone;

  private baseUrl = this.endPoint + '/products?size=100';
  private categoryUrl = this.endPoint + '/product-category';

  getProductsList(
    page: number,
    pageSize: number,
    id?: number
  ): Observable<Product[]> {
    if (id)
      this.baseUrl =
        `${this.endPoint}/products/search/findByCategoryId?id=${id}` +
        `&page=${page}&size=${pageSize}`;

    return this.getProducts(this.baseUrl);
  }

  getProductsListPaginate(
    page: number,
    pageSize: number,
    id?: number
  ): Observable<GetResponse> {
    if (id)
      this.baseUrl =
        `${this.endPoint}/products/search/findByCategoryId?id=${id}` +
        `&page=${page}&size=${pageSize}`;

    return this.http.get<GetResponse>(this.baseUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.http
      .get<GetResponseProductCategory>(this.categoryUrl)
      .pipe(map((response: any) => response._embedded.productCategory));
  }

  getSearchedProducts(searchKey: string): Observable<Product[]> {
    this.baseUrl = `${this.endPoint}/products/search/findByNameContaining?name=${searchKey}`;

    return this.getProducts(this.baseUrl);
  }

  getSearchedProductsPaginate(
    searchKey: string,
    page: number,
    pageSize: number
  ): Observable<GetResponse> {
    this.baseUrl =
      `${this.endPoint}/products/search/findByNameContaining?name=${searchKey}` +
      `&page=${page}&size=${pageSize}`;

    return this.http.get<GetResponse>(this.baseUrl);
  }

  private getProducts(url: string): Observable<any> {
    return this.http
      .get<GetResponse>(url)
      .pipe(map((response: any) => response._embedded.products));
  }

  getProductDetails(id: number): Observable<Product> {
    const baseUrl = `${this.endPoint}/products/${id}`;

    return this.http.get<Product>(baseUrl).pipe(map((response) => response));
  }
}

interface GetResponse {
  _embedded: {
    products: Product[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  };
}
