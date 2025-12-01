package com.multicore.crm.service;

import com.multicore.crm.dto.CustomerDto;
import com.multicore.crm.entity.Customer;
import com.multicore.crm.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    public Customer createCustomer(CustomerDto dto) {
        Customer customer = new Customer();
        customer.setBusinessId(dto.getBusinessId());
        customer.setName(dto.getName());
        customer.setEmail(dto.getEmail());
        customer.setPhone(dto.getPhone());
        customer.setAddress(dto.getAddress());
        customer.setSource(dto.getSource());
        return customerRepository.save(customer);
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findByDeletedFalse();
    }

    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id)
                .filter(c -> !c.getDeleted())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    public Customer updateCustomer(Long id, CustomerDto dto) {
        Customer customer = getCustomerById(id);
        customer.setBusinessId(dto.getBusinessId());
        customer.setName(dto.getName());
        customer.setEmail(dto.getEmail());
        customer.setPhone(dto.getPhone());
        customer.setAddress(dto.getAddress());
        customer.setSource(dto.getSource());
        return customerRepository.save(customer);
    }

    public void deleteCustomer(Long id) {
        Customer customer = getCustomerById(id);
        customer.setDeleted(true); // soft delete
        customerRepository.save(customer);
    }
}
