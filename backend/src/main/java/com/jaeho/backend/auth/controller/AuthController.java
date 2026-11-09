package com.jaeho.backend.auth.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jaeho.backend.auth.dto.LoginRequest;
import com.jaeho.backend.auth.dto.LoginResponse;
import com.jaeho.backend.auth.dto.SignupRequest;
import com.jaeho.backend.auth.dto.SignupResponse;
import com.jaeho.backend.auth.service.AuthService;
import com.jaeho.backend.auth.service.EmailService;
import com.jaeho.backend.employee.entity.Employee;

import org.springframework.security.crypto.password.PasswordEncoder;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	private final AuthService authService;
	private final EmailService emailService;
	
	public AuthController(AuthService authService,
			EmailService emailService){
		this.authService = authService;
		this.emailService = emailService;
	}
	
	@PostMapping("/login")
	public ResponseEntity<String> login(
			@RequestBody LoginRequest request){

		String token = authService.login(request);
		
		return ResponseEntity.ok(token);
	}
	
	@PostMapping("/test")
	public void test(
			@RequestBody SignupRequest signupRequest){
		
		authService.test(signupRequest);
	}
	
	@PostMapping("/employee/register")
	public ResponseEntity<SignupResponse> register(
			@RequestBody SignupRequest request){
		Employee employee = authService.register(request);
		
		SignupResponse response = new SignupResponse(
				employee.getEmployeeCode(),
				employee.getName(),
				employee.getEmail()
				);
		
		return ResponseEntity
				.status(HttpStatus.CREATED)
				.body(response);
	}
	
}
