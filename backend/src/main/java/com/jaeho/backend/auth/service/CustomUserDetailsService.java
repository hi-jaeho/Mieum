package com.jaeho.backend.auth.service;

import java.util.Optional;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.jaeho.backend.auth.dto.CustomUserDetails;
import com.jaeho.backend.employee.entity.Employee;
import com.jaeho.backend.employee.repository.EmployeeRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService{

	private final EmployeeRepository employeeRepository;
	
	public CustomUserDetailsService(EmployeeRepository employeeRepository) {
		this.employeeRepository = employeeRepository;
	}
	
	@Override
	public UserDetails loadUserByUsername(String employeeCode) {
		// 1. employeeCode로 Employee 조회
		// 2. 없다면 UsernameNotFoundException
		Employee employee = employeeRepository.findByEmployeeCode(employeeCode)
				.orElseThrow(() -> new UsernameNotFoundException("존재하지 않는 회원입니다."));

        // 3. Employee를 CustomUserDetails로 변환
		CustomUserDetails user = new CustomUserDetails(employee);
		
        // 4. 반환
		return user;
	}
	
}	
