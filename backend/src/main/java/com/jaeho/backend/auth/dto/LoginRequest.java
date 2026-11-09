package com.jaeho.backend.auth.dto;

import jakarta.validation.constraints.NotBlank;

public class LoginRequest {
	@NotBlank(message = "아이디는 필수입니다.")
	private String employeeCode;
	
	@NotBlank(message = "비밀번호는 필수입니다.")
	private String password;

	public String getEmployeeCode() {
		return employeeCode;
	}

	public void setEmployeeCode(String employeeCode) {
		this.employeeCode = employeeCode;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
}

