package com.jaeho.backend.auth.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthTestController {

    @GetMapping("/api/auth-test")
    public String test() {

        // 현재 요청의 인증 정보 가져오기
        Authentication authentication =
                SecurityContextHolder.getContext()
                        .getAuthentication();

        // 인증된 직원코드 반환
        return "인증 성공: " + authentication.getName();
    }
}