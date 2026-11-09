package com.jaeho.backend.admin;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminTestController {
	
	@GetMapping("/test")
	public ResponseEntity<String> adminTest() {
		return ResponseEntity.ok("ADMIN 접근 성공");
	}
}
