package com.jaeho.backend.test;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SecurityTestController {

    @GetMapping("/public")
    public String publicPage() {
        return "누구나 접근 가능";
    }

    @GetMapping("/private")
    public String privatePage() {
        return "로그인한 사용자만 접근 가능";
    }
}