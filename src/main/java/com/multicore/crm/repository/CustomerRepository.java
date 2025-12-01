package com.multicore.crm.repository;

import com.multicore.crm.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    // Return only non-deleted customers
    List<Customer> findByDeletedFalse();
}
