package com.jaeho.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.jaeho.backend.auth.handler.CustomAccessDeniedHandler;
import com.jaeho.backend.auth.handler.CustomAuthenticationEntryPoint;
import com.jaeho.backend.auth.jwt.JwtAuthenticationFilter;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityConfig {
	
	private final JwtAuthenticationFilter jwtAuthenticationFilter;
	private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;
	private final CustomAccessDeniedHandler customAccessDeniedHandler;
	
	// 의존성 주입
	public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
			CustomAuthenticationEntryPoint customAuthenticationEntryPoint,
			CustomAccessDeniedHandler customAccessDeniedHandler) {
	    this.jwtAuthenticationFilter = jwtAuthenticationFilter;
	    this.customAuthenticationEntryPoint = customAuthenticationEntryPoint;
	    this.customAccessDeniedHandler = customAccessDeniedHandler;	
	}
	
	@Bean
	public PasswordEncoder passwordEncoder() {
	    return new BCryptPasswordEncoder();
	}
	
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
	     	// React에서 API 요청을 허용하기 위한 CORS 설정
	        .cors(Customizer.withDefaults())
	        
        	// JWT 기반 API이므로 CSRF 비활성화
        	.csrf(csrf -> csrf.disable())
        	
        	// 서버에서 로그인 세션을 생성하지 않음 -> JWT
            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )
            
            // API별 접근 권한 설정
            .authorizeHttpRequests(auth -> auth
            		
            	// 로그인 API는 인증 없이 접근 가능
                .requestMatchers("/api/auth/login").permitAll()
                
                // 관리자 API는 ADMIN 권한 필요
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                
                // 나머지 API는 로그인한 사용자만 접근 가능
                .anyRequest().authenticated()
            )
            
            
            // 인증 및 권한 오류 처리
            .exceptionHandling(exception -> exception
            		// 인증되지 않은 사용자 접근 시, customAuthenticationEntryPoint를 사용 -> 401 Unauthorized
                    .authenticationEntryPoint(customAuthenticationEntryPoint)
                    
                    // 권한이 없는 사용자 접근 시, customAccessDeniedHandler를 사용 -> 403
                    .accessDeniedHandler(customAccessDeniedHandler)
                )
            
            // JWT 인증 필터 등록
            .addFilterBefore(
                    jwtAuthenticationFilter,
                    UsernamePasswordAuthenticationFilter.class
            );
        return http.build();
    }
    
    
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration) throws Exception {

        return authenticationConfiguration.getAuthenticationManager();
    }
}