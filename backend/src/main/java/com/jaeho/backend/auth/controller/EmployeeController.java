package com.jaeho.backend.auth.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jaeho.backend.employee.entity.Department;
import com.jaeho.backend.employee.entity.JobPosition;
import com.jaeho.backend.employee.service.EmployeeService;

@RestController
@RequestMapping("/api/employee")
public class EmployeeController {
		private final EmployeeService employeeService;
		
		public EmployeeController(EmployeeService employeeService) {
			this.employeeService = employeeService;
		}
		
		// 모든 부서를 조회
		@GetMapping("/departments")
		public ResponseEntity<List<Department>> getDepartments(){
			List<Department> departments = employeeService.getDepartments();
			
			return ResponseEntity.ok(departments);
		}
		
		// 모든 직책을 조회
		@GetMapping("/jobpositions")
		public ResponseEntity<List<JobPosition>> getJobPositions(){
			List<JobPosition> jobPositions = employeeService.getJobPositions();
			
			return ResponseEntity.ok(jobPositions);
		}
		
	
}
