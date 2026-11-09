package com.jaeho.backend.employee.service;

import org.springframework.stereotype.Service;

import com.jaeho.backend.employee.entity.Department;
import com.jaeho.backend.employee.entity.JobPosition;
import com.jaeho.backend.employee.repository.DepartmentRepository;
import com.jaeho.backend.employee.repository.JobPositionRepository;

import java.util.List;

@Service
public class EmployeeService {
	
	private final DepartmentRepository departmentRepository;
	private final JobPositionRepository jobPositionRepository;
	
	public EmployeeService(DepartmentRepository departmentRepository,
			JobPositionRepository jobPositionRepository) {
		this.departmentRepository = departmentRepository;
		this.jobPositionRepository = jobPositionRepository;
	}
	
	// 부서 전체 조회
	public List<Department> getDepartments() {
		return departmentRepository.findAll();
	}
	
	// 직채 전체 조회
	public List<JobPosition> getJobPositions() {
		return jobPositionRepository.findAll();
	}
}
