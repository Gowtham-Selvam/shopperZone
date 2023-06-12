package com.ecommerce.shopperzone.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.context.annotation.Configuration;

@Entity
@Getter
@Setter
@Table(name="address")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name ="id")
    private Long id;
    @Column(name ="city")
    private String city;
    @Column(name ="state")
    private String state;
    @Column(name ="country")
    private String country;
    @Column(name ="street")
    private String street;
    @Column(name ="zip_code")
    private String zipCode;

    @OneToOne
    @PrimaryKeyJoinColumn
    private Order order;

}
