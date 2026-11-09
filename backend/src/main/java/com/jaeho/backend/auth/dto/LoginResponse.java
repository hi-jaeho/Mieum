package com.jaeho.backend.auth.dto;

public class LoginResponse {
	private Integer employeeId;
	private String employeeCode;
	private String name;
	private String profile_image_url;
	private String status_message;
	private String role;
	
	public LoginResponse(Integer employeeId, String employeeCode, String name, String profile_image_url, String status_message, String role) {
		this.employeeId = employeeId;
		this.employeeCode = employeeCode;
		this.name = name;
		this.profile_image_url = profile_image_url;
		this.status_message = status_message;
		this.role = role;
	}

	public Integer getEmployeeId() {
		return employeeId;
	}
	
	public String getEmployeeCode() {
		return employeeCode;
	}

	public String getName() {
		return name;
	}

	public String getProfile_image_url() {
		return profile_image_url;
	}

	public String getStatus_message() {
		return status_message;
	}

	public String getRole() {
		return role;
	}
}
