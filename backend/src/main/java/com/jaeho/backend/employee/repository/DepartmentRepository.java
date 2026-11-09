package com.jaeho.backend.employee.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jaeho.backend.employee.entity.Department;

public interface DepartmentRepository extends JpaRepository<Department, Integer>{

}
