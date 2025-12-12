package com.multicore.crm.service;

import com.multicore.crm.dto.*;
import com.multicore.crm.entity.Appointment;
import com.multicore.crm.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository repo;

    private AppointmentDTO map(Appointment a) {
        AppointmentDTO dto = new AppointmentDTO();
        dto.setId(a.getId());
        dto.setBusinessId(a.getBusinessId());
        dto.setUserId(a.getUserId());
        dto.setCustomerId(a.getCustomerId());
        dto.setDate(a.getDate());
        dto.setTime(a.getTime());
        dto.setLocation(a.getLocation());
        dto.setNote(a.getNote());
        dto.setStatus(a.getStatus());
        dto.setCreatedAt(a.getCreatedAt());
        dto.setUpdatedAt(a.getUpdatedAt());
        return dto;
    }

    @Override
    public AppointmentDTO create(AppointmentCreateDTO dto) {
        Appointment a = new Appointment();
        a.setBusinessId(dto.getBusinessId());
        a.setUserId(dto.getUserId());
        a.setCustomerId(dto.getCustomerId());
        a.setDate(dto.getDate());
        a.setTime(dto.getTime());
        a.setLocation(dto.getLocation());
        a.setNote(dto.getNote());
        repo.save(a);
        return map(a);
    }

    @Override
    public AppointmentDTO update(Long id, AppointmentUpdateDTO dto) {
        Appointment a = repo.findById(id).orElseThrow();
        a.setDate(dto.getDate());
        a.setTime(dto.getTime());
        a.setLocation(dto.getLocation());
        a.setNote(dto.getNote());
        repo.save(a);
        return map(a);
    }

    @Override
    public AppointmentDTO updateStatus(Long id, AppointmentStatusUpdateDTO dto) {
        Appointment a = repo.findById(id).orElseThrow();
        a.setStatus(dto.getStatus());
        repo.save(a);
        return map(a);
    }

    @Override
    public AppointmentDTO getById(Long id) {
        return map(repo.findById(id).orElseThrow());
    }

    @Override
    public List<AppointmentDTO> getByBusiness(Long businessId) {
        return repo.findByBusinessId(businessId).stream().map(this::map).collect(Collectors.toList());
    }

    @Override
    public List<AppointmentDTO> getByUser(Long userId) {
        return repo.findByUserId(userId).stream().map(this::map).collect(Collectors.toList());
    }

    @Override
    public List<AppointmentDTO> getByCustomer(Long customerId) {
        return repo.findByCustomerId(customerId).stream().map(this::map).collect(Collectors.toList());
    }

    @Override
    public List<AppointmentDTO> getAppointmentsForDate(Long businessId, String date) {
        LocalDate d = LocalDate.parse(date);
        return repo.findByBusinessIdAndDate(businessId, d).stream().map(this::map).collect(Collectors.toList());
    }
}
