package com.jaeho.backend.auth.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jaeho.backend.auth.service.TestService;
import com.jaeho.backend.employee.entity.Employee;

@RestController
public class TestController {
	private final TestService testService;
	
	public TestController(TestService testService) {
		this.testService = testService;
	}
	
	@GetMapping("/api/members")
	public List<Employee> findAll() {
        return testService.getAllMembers();
    }
	
}
