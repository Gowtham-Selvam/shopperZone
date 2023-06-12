package com.ecommerce.shopperzone.service;

import com.ecommerce.shopperzone.dto.PaymentInfo;
import com.ecommerce.shopperzone.dto.Purchase;
import com.ecommerce.shopperzone.dto.PurchaseResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);

    PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException;
}
