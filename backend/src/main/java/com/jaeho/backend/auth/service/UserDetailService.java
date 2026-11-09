package com.jaeho.backend.auth.service;

import org.springframework.security.core.userdetails.UserDetails;

public interface UserDetailService {

	UserDetails loadUserByUsername(String employeeCode);

}
