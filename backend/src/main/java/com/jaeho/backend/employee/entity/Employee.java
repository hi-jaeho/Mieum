package com.jaeho.backend.employee.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.DynamicInsert;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "EMPLOYEE")
@DynamicInsert
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "EMPLOYEE_ID")
    private Integer employeeId;
    
    @Column(name = "EMPLOYEE_CODE", nullable = false, unique = true)
    private String employeeCode;
    
    @Column(name = "NAME", nullable = false)
    private String name;

    @Column(name = "PASSWORD", nullable = false)
    private String password;

    @Column(name = "DEPARTMENT_ID")
    private Integer departmentId;

    @Column(name = "POSITION_ID")
    private Integer positionId;

    @Column(name = "EMAIL", nullable = false, unique = true)
    private String email;

    @Column(name = "PHONE", unique = true)
    private String phone;

    @Column(name = "ADDRESS")
    private String address;

    @Column(name = "PROFILE_IMAGE_URL")
    private String profileImageUrl;

    @Column(name = "STATUS_MESSAGE")
    private String statusMessage;

    @Column(name = "ROLE", insertable = false)
    private String role;

    @Column(name = "ACCOUNT_STATUS", insertable = false)
    private String accountStatus;

    @Column(name = "LOGIN_FAIL_COUNT", insertable = false)
    private Integer loginFailCount;
    
    @Column(name = "CREATED_AT", insertable = false)
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_AT", insertable = false)
    private LocalDateTime updatedAt;

    protected Employee() {
    }
    
    public Employee(String employeeCode, String name, String password, Integer departmentId, Integer positionId, String email) {
    	this.employeeCode = employeeCode;
    	this.name = name;
    	this.password = password;
    	this.departmentId = departmentId;
    	this.positionId = positionId;
    	this.email = email;
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

	public String getPassword() {
		return password;
	}

	public Integer getDepartmentId() {
		return departmentId;
	}

	public Integer getPositionId() {
		return positionId;
	}

	public String getEmail() {
		return email;
	}

	public String getPhone() {
		return phone;
	}

	public String getAddress() {
		return address;
	}

	public String getProfileImageUrl() {
		return profileImageUrl;
	}

	public String getStatusMessage() {
		return statusMessage;
	}

	public String getRole() {
		return role;
	}

	public String getAccountStatus() {
		return accountStatus;
	}

	public Integer getLoginFailCount() {
		return loginFailCount;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}
	
}
