import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  productData: Product[] = [];
  productCategoryId: number = 1;
  searchMode: boolean;
  previousCategoryId: number = 1;

  pageNumber: number = 1;
  pageSize: number = 5;
  totalElements: number = 0;
  previousKeyWord: string = '';

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.getProductData();
    });
  }

  getProductData() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) this.handleSearchProducts();
    else this.handleListProducts();
  }

  handleSearchProducts() {
    const searchKey = this.route.snapshot.paramMap.get('keyword')!;

    if (this.previousKeyWord !== searchKey) this.pageNumber = 1;
    this.previousKeyWord = searchKey;

    this.productService
      .getSearchedProductsPaginate(
        searchKey,
        this.pageNumber - 1,
        this.pageSize
      )
      .subscribe((response) => {
        this.productData = response._embedded.products;
        this.pageNumber = response.page.number + 1;
        this.pageSize = response.page.size;
        this.totalElements = response.page.totalElements;
      });
  }

  handleListProducts() {
    const hasCategoryId = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId)
      this.productCategoryId = +this.route.snapshot.paramMap.get('id')!;
    else this.productCategoryId = 1;

    if (this.previousCategoryId !== this.productCategoryId) this.pageNumber = 1;

    this.previousCategoryId = this.productCategoryId;

    this.productService
      .getProductsListPaginate(
        this.pageNumber - 1,
        this.pageSize,
        this.productCategoryId
      )
      .subscribe((response) => {
        this.productData = response._embedded.products;
        this.pageNumber = response.page.number + 1;
        this.pageSize = response.page.size;
        this.totalElements = response.page.totalElements;
      });
  }

  updatePageSize(size: number) {
    this.pageSize = size;
    this.pageNumber = 1;
    this.handleListProducts();
  }

  addToCart(product: Product) {
    const item = new CartItem(product);
    this.cartService.addToCart(item);
  }
}
