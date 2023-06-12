package com.ecommerce.shopperzone.dto;

import com.ecommerce.shopperzone.entity.Address;
import com.ecommerce.shopperzone.entity.Customer;
import com.ecommerce.shopperzone.entity.Order;
import com.ecommerce.shopperzone.entity.OrderItems;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;
    private Address billingAdress;
    private Address shippingAdress;
    private Order order;
    private Set<OrderItems> orderItems;

}
