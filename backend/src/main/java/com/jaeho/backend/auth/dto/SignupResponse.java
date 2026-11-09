package com.jaeho.backend.auth.dto;

public class SignupResponse {
	private String employeeCode;
	private String name;
	private String email;
		
	public SignupResponse() {}

	public SignupResponse(String employeeCode, String name, String email) {
		this.employeeCode = employeeCode;
		this.name = name;
		this.email = email;
	}

	public String getEmployeeCode() {
		return employeeCode;
	}

	public String getName() {
		return name;
	}

	public String getEmail() {
		return email;
	}
}
