package com.ecommerce.shopperzone.service;

import com.ecommerce.shopperzone.dao.CustomerRepository;
import com.ecommerce.shopperzone.dto.PaymentInfo;
import com.ecommerce.shopperzone.dto.Purchase;
import com.ecommerce.shopperzone.dto.PurchaseResponse;
import com.ecommerce.shopperzone.entity.Customer;
import com.ecommerce.shopperzone.entity.Order;
import com.ecommerce.shopperzone.entity.OrderItems;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CheckoutServiceImpl implements CheckoutService{

    @Autowired
    private CustomerRepository customerRepository;

    @Value("${stripe.key.secret}")
    String secretKey;

    private static final Logger LOGGER = LoggerFactory.getLogger(CheckoutServiceImpl.class);
    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {

        Order order = purchase.getOrder();

        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        Set<OrderItems>orderItems = purchase.getOrderItems();
        orderItems.forEach(item -> order.add(item));

        order.setBillingAddress(purchase.getBillingAdress());
        order.setShippingAddress(purchase.getShippingAdress());

        Customer customer = purchase.getCustomer();
        String email = customer.getEmail();
        Customer newCustomer = customerRepository.findByEmail(email);
        if(newCustomer != null) {
            customer = newCustomer;
        }
        customer.addOrders(order);

        customerRepository.save(customer);
        return new PurchaseResponse(orderTrackingNumber);
    }

    @Override
    public PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException {
        Stripe.apiKey = this.secretKey;

        List<String> paymentMethodTypes = new ArrayList<>();
        paymentMethodTypes.add("card");

        Map<String, Object>params = new HashMap<>();
        params.put("amount", paymentInfo.getAmount());
        params.put("currency", paymentInfo.getCurrency());
        params.put("payment_method_types", paymentMethodTypes);
        params.put("receipt_email", paymentInfo.getReceiptEmail());

        return PaymentIntent.create(params);
    }

    private String generateOrderTrackingNumber() {
        return UUID.randomUUID().toString();
    }
}
