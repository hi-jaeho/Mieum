package com.jaeho.backend.auth.dto;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.jaeho.backend.employee.entity.Employee;

// Spring Security에서 사용할 사용자 정보 객체
public class CustomUserDetails implements UserDetails {
	
	private final Employee employee;
	
	public CustomUserDetails(Employee employee) {
		this.employee = employee;
	}
	
	@Override
	// 여기서 getUsername은 로그인 시 아이디
	public String getUsername() {
		return employee.getEmployeeCode();
	}
	
	@Override
    public String getPassword() {
        return employee.getPassword();
    }
	
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
	    return List.of(
	        new SimpleGrantedAuthority("ROLE_" + employee.getRole())
	    );
	}
}
