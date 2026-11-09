package com.jaeho.backend.auth.service;

import org.springframework.stereotype.Service;

import java.util.List;

import com.jaeho.backend.employee.entity.Employee;
import com.jaeho.backend.employee.repository.EmployeeRepository;

@Service
public class TestService {
	private final EmployeeRepository employeeRepository;
	
	public TestService(EmployeeRepository employeeRepository) {
		this.employeeRepository = employeeRepository;
	}
	
	public List<Employee> getAllMembers() {
	    List<Employee> members = employeeRepository.findAll();

	    System.out.println("조회 개수 = " + members.size());

	    return members;
	}
}
