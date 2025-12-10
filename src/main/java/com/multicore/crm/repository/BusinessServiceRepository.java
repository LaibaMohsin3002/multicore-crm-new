package com.multicore.crm.repository;

import com.multicore.crm.entity.BusinessServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BusinessServiceRepository extends JpaRepository<BusinessServiceEntity, Long> {
    List<BusinessServiceEntity> findByBusinessId(Long businessId);
}

