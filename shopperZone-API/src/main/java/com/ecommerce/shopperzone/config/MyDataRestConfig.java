package com.ecommerce.shopperzone.config;

import com.ecommerce.shopperzone.entity.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    @Autowired
    private EntityManager entityManager;
    @Value("${allowed.origins}")
    private String[] allowedOrigin;

    @Override
    //RepositoryRestConfiguration - Inbuilt class provided by spring and has various methods which helps us in blacklisting certain http methods so that user will not have access to them.
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        HttpMethod[] unsupported = {HttpMethod.DELETE, HttpMethod.POST, HttpMethod.PUT, HttpMethod.PATCH};

        disableHttpMethods(ProductCategory.class,config, unsupported);
        disableHttpMethods(Product.class,config, unsupported);
        disableHttpMethods(Country.class,config, unsupported);
        disableHttpMethods(State.class,config, unsupported);
        disableHttpMethods(Order.class,config, unsupported);

        exposeIds(config);

        cors.addMapping("/api/**").allowedOrigins(allowedOrigin);
    }

    private static void disableHttpMethods(Class className, RepositoryRestConfiguration config, HttpMethod[] unsupported) {
        config.getExposureConfiguration().forDomainType(className)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(unsupported))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(unsupported));
    }

    public void exposeIds(RepositoryRestConfiguration config) {
        //Get a list of all entity classes from entity manager
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

        //Creating an array of entity types
        List <Class> entityClass= new ArrayList<>();

        //Get the entity type for the entities
        for(EntityType entityType: entities) {
            entityClass.add(entityType.getJavaType());
        }

        //expose entity ids for array of domain types
        Class[] domainTypes = entityClass.toArray(new Class[0]);
        config.exposeIdsFor(domainTypes);

    }
}
