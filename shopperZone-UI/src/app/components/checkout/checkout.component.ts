import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { ShopperZoneFormService } from '../../services/shopper-zone-form.service';
import { CustomFormValidators } from 'src/app/validators/custom-form-validators';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Router } from '@angular/router';
import { Purchase } from 'src/app/common/purchase';
import { OrderItem } from 'src/app/common/order-item';
import { Order } from 'src/app/common/order';
import { environment } from 'src/environments/environment';
import { PaymentInfo } from 'src/app/common/payment-info';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  totalPrice: number;
  totalQuantity: number;
  creditCardMonth: number[];
  creditCardYear: Observable<number[]>;
  countriesList: Country[];
  shippingAddressStates: State[];
  billingAddressStates: State[];
  stripe = Stripe(environment.stripePublishableKey);
  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any;
  isDisabled = false;

  constructor(
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private shopperZoneFormService: ShopperZoneFormService,
    private checkoutService: CheckoutService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setupStripePaymentForm();

    this.checkoutForm = this.formBuilder.group({
      customerDetails: this.formBuilder.group({
        firstName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomFormValidators.onlySpaceError,
        ]),
        lastName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomFormValidators.onlySpaceError,
        ]),
        email: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ]),
      }),

      shippingAddress: this.formBuilder.group({
        streetName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomFormValidators.onlySpaceError,
        ]),
        district: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomFormValidators.onlySpaceError,
        ]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.maxLength(6),
          Validators.minLength(6),
          Validators.pattern('^(0|[1-9][0-9]*)$'),
        ]),
      }),

      billingAddress: this.formBuilder.group({
        streetName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomFormValidators.onlySpaceError,
        ]),
        district: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomFormValidators.onlySpaceError,
        ]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.maxLength(6),
          Validators.minLength(6),
          Validators.pattern('^(0|[1-9][0-9]*)$'),
        ]),
      }),

      creditCard: this.formBuilder.group({
        // cardType: new FormControl('', [Validators.required]),
        // name: new FormControl('', [
        //   Validators.required,
        //   Validators.minLength(2),
        //   CustomFormValidators.onlySpaceError,
        // ]),
        // cardNumber: new FormControl('', [
        //   Validators.required,
        //   Validators.maxLength(16),
        //   Validators.minLength(16),
        //   Validators.pattern('^(0|[1-9][0-9]*)$'),
        // ]),
        // cvv: new FormControl('', [
        //   Validators.required,
        //   Validators.maxLength(3),
        //   Validators.minLength(3),
        //   Validators.pattern('^(0|[1-9][0-9]*)$'),
        // ]),
        // expiryMonth: new FormControl('', [Validators.required]),
        // expiryYear: new FormControl('', [Validators.required]),
      }),
    });

    this.cartService.totalPrice.subscribe((data) => {
      this.totalPrice = data;
    });
    this.cartService.totalQuantity.subscribe((data) => {
      this.totalQuantity = data;
    });

    this.shopperZoneFormService.getCountriesList().subscribe((data) => {
      this.countriesList = data;
    });
  }

  setupStripePaymentForm() {
    const elements = this.stripe.elements();

    this.cardElement = elements.create('card', { hidePostalCode: true });

    this.cardElement.mount('#card-element');

    this.cardElement.on('change', (event: any) => {
      this.displayError = document.getElementById('card-errors');

      if (event.complete) this.displayError.textContent = '';
      else if (event.error) this.displayError.textContent = event.error.message;
    });
  }

  get firstName() {
    return this.checkoutForm.get('customerDetails.firstName');
  }

  get lastName() {
    return this.checkoutForm.get('customerDetails.lastName');
  }

  get email() {
    return this.checkoutForm.get('customerDetails.email');
  }

  get shippingStreet() {
    return this.checkoutForm.get('shippingAddress.streetName');
  }
  get shippingDistrict() {
    return this.checkoutForm.get('shippingAddress.district');
  }
  get shippingState() {
    return this.checkoutForm.get('shippingAddress.state');
  }
  get shippingCountry() {
    return this.checkoutForm.get('shippingAddress.country');
  }
  get shippingZipCode() {
    return this.checkoutForm.get('shippingAddress.zipCode');
  }

  get billingStreet() {
    return this.checkoutForm.get('billingAddress.streetName');
  }
  get billingDistrict() {
    return this.checkoutForm.get('billingAddress.district');
  }
  get billingState() {
    return this.checkoutForm.get('billingAddress.state');
  }
  get billingCountry() {
    return this.checkoutForm.get('billingAddress.country');
  }
  get billingZipCode() {
    return this.checkoutForm.get('billingAddress.zipCode');
  }

  get creditCardType() {
    return this.checkoutForm.get('creditCard.cardType');
  }
  get cardName() {
    return this.checkoutForm.get('creditCard.name');
  }
  get cardNumber() {
    return this.checkoutForm.get('creditCard.cardNumber');
  }
  get cvv() {
    return this.checkoutForm.get('creditCard.cvv');
  }
  get month() {
    return this.checkoutForm.get('creditCard.expiryMonth');
  }
  get year() {
    return this.checkoutForm.get('creditCard.expiryYear');
  }

  onSubmit() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    const payload: Purchase = this.generatePurchaseOrder();

    this.paymentInfo.amount = Math.round(this.totalPrice * 100);
    this.paymentInfo.currency = 'USD';
    this.paymentInfo.receiptEmail = payload.customer.email;

    if (!this.checkoutForm.invalid && this.displayError.textContent === '') {
      this.isDisabled = true;
      this.checkoutService
        .createPaymentIntent(this.paymentInfo)
        .subscribe((response) => {
          this.stripe
            .confirmCardPayment(
              response.client_secret,
              {
                payment_method: {
                  card: this.cardElement,
                  billing_details: {
                    email: payload.customer.email,
                    name: `${payload.customer.firstName} ${payload.customer.lastName}`,
                    address: {
                      line1: payload.billingAddress.street,
                      city: payload.billingAddress.city,
                      state: payload.billingAddress.state,
                      postal_code: payload.billingAddress.zipCode,
                      country: this.billingCountry.value.code,
                    },
                  },
                },
              },
              { handleActions: false }
            )
            .then((result: any) => {
              if (result.error) {
                alert(`Error: ${result.error.message}`);
                this.isDisabled = false;
              } else {
                this.checkoutService.placeOrder(payload).subscribe({
                  next: (response: any) => {
                    alert(
                      `Order placed successfully:  ${response.orderTrackingNumber}`
                    );

                    this.resetCart();
                    this.isDisabled = false;
                  },
                  error: (err: any) => {
                    alert(`Error Occured: ${err.message}`);
                    this.isDisabled = false;
                  },
                });
              }
            });
        });
    } else {
      this.checkoutForm.markAllAsTouched();
      return;
    }
  }

  resetCart() {
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    this.checkoutForm.reset();
    this.cartService.persistCartItems();

    this.router.navigateByUrl('/products');
  }

  generatePurchaseOrder() {
    const cartItems = this.cartService.cartItems;

    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    let orderItem: OrderItem[] = cartItems.map((item) => new OrderItem(item));
    let purchase: Purchase = new Purchase();

    purchase.customer = this.checkoutForm.get('customerDetails').value;

    purchase.shippingAddress = this.checkoutForm.get('shippingAddress').value;
    const shippingState = JSON.parse(
      JSON.stringify(purchase.shippingAddress.state)
    );
    const shippingCountry = JSON.parse(
      JSON.stringify(purchase.shippingAddress.country)
    );
    purchase.shippingAddress.state = shippingState;
    purchase.shippingAddress.country = shippingCountry;

    purchase.billingAddress = this.checkoutForm.get('billingAddress').value;
    const billingState = JSON.parse(
      JSON.stringify(purchase.billingAddress.state)
    );
    const billingCountry = JSON.parse(
      JSON.stringify(purchase.billingAddress.country)
    );
    purchase.billingAddress.state = billingState;
    purchase.billingAddress.country = billingCountry;

    purchase.orderItems = orderItem;
    purchase.order = order;

    return purchase;
  }

  copyShippingToBillingAddress(evt: any) {
    if (evt.target.checked) {
      this.checkoutForm.controls.billingAddress.setValue(
        this.checkoutForm.controls.shippingAddress.value
      );
      this.checkoutForm.controls.billingAddress.disable();
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutForm.controls.billingAddress.reset();
      this.checkoutForm.controls.billingAddress.enable();
      this.billingAddressStates = [];
    }
  }

  getStatesListForShipping() {
    const shippingCountryCode =
      this.checkoutForm.get('shippingAddress').value.country.code;
    this.shopperZoneFormService
      .getStatesList(shippingCountryCode)
      .subscribe((data) => {
        this.shippingAddressStates = data;
      });
  }

  getStatesListForBilling() {
    const billingCountryCode =
      this.checkoutForm.get('billingAddress').value.country.code;
    this.shopperZoneFormService
      .getStatesList(billingCountryCode)
      .subscribe((data) => {
        this.billingAddressStates = data;
      });
  }
}
