package com.ecommerce.shopperzone.dao;

import com.ecommerce.shopperzone.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;


@CrossOrigin("https://localhost:4200")
@RepositoryRestResource
public interface ProductRepository extends JpaRepository<Product, Long> {
    //Page - it is an interface provided by spring. It is a sublist of list of objects. Has information like totalelements, totalpage, currentposition etc....
    //Pageable - Also an interface which has information like pageNumber, pageSize, previous, next etc.
    //findByCategoryId - spring converts it into a query and fetch the result from db
    Page<Product> findByCategoryId(@Param("id") Long id, Pageable pageable);

    Page<Product> findByNameContaining(@Param("name") String name, Pageable pageable);
}
