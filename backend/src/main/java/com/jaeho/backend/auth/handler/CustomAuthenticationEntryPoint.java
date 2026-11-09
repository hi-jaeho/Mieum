package com.jaeho.backend.auth.handler;

import java.io.IOException;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class CustomAuthenticationEntryPoint
        implements AuthenticationEntryPoint {
	// AuthenticationEntryPoint = Spring Security에서 인증되지 않은 사용자가 
	// 인증이 필요한 API에 접근했을 때 호출되는 인터페이스
    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException
    ) throws IOException, ServletException {
    	
    	// SC_UNAUTHORIZED = HTTP 상태 코드 401을 의미
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        
        // 응답 데이터가 JSON이라는 것을 의미
        response.setContentType("application/json");
        
        // 한글 깨지지 않도록 인코딩
        response.setCharacterEncoding("UTF-8");
        
        // 실제 Response Body 내용
        response.getWriter().write(
                """
                {
                    "status": 401,
                    "message": "인증이 필요합니다."
                }
                """
        );
    }
}