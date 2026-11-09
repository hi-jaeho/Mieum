package com.jaeho.backend.employee.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jaeho.backend.employee.entity.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
	
	boolean existsByPhone(String phone);
	
	Optional<Employee> findByEmployeeCode(String employeeCode);
}
