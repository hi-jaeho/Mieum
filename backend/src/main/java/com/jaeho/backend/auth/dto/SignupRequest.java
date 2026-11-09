
package com.jaeho.backend.auth.dto;

import jakarta.validation.constraints.NotBlank;

public class SignupRequest {
	
	@NotBlank(message = "이름을 입력해주세요.")
	private String name;
	
	@NotBlank(message = "부서명을 입력해주세요.")
	private int departmentId;
	
	@NotBlank(message = "직책명을 입력해주세요.")
	private int positionId;
	
	@NotBlank(message = "이메일 주소를 입력해주세요.")
	private String email;
	
	public String getName() {
		return name;
	}

	public int getDepartmentId() {
		return departmentId;
	}

	public int getPositionId() {
		return positionId;
	}
	
	public String getEmail() {
		return email;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setDepartmentId(int departmentId) {
		this.departmentId = departmentId;
	}

	public void setPositionId(int positionId) {
		this.positionId = positionId;
	}

	public void setEmail(String email) {
		this.email = email;
	}
}
