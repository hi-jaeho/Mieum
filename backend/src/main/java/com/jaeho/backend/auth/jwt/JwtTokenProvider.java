package com.jaeho.backend.auth.jwt;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;



// JWT 생성 및 정보 추출
@Component
public class JwtTokenProvider {
	
	// application.properties에서 jwt 설정값 가져오기
	@Value("${jwt.secret}")
	private String secretKey;
	
	@Value("${jwt.expiration}")
	private long expiration;
	
	private SecretKey getSigningKey() {
	    byte[] keyBytes = Decoders.BASE64.decode(secretKey);
	    return Keys.hmacShaKeyFor(keyBytes);
	}
	
	public String createToken(String employeeCode) {

	    Date now = new Date(); // 토큰을 발급한 현재 시간
	    Date expiryDate = new Date(now.getTime() + expiration);

	    return Jwts.builder() // 토큰 제작
	            .subject(employeeCode) // 토큰 주인 지정
	            .issuedAt(now) // 발급 시간('iat')
	            .expiration(expiryDate) // 만료 시간('exp')
	            .signWith(getSigningKey()) // 서명 수단
	            .compact(); 
	}
	
	// 토큰에서 사용자의 직원코드(아이디) 가져오기
	public String getEmployeeCode(String token) {

	    return Jwts.parser() // 토큰 읽기위한 파서 생성
	            .verifyWith(getSigningKey()) // 서명 검증
	            .build() 
	            .parseSignedClaims(token) // 토큰의 문자열 분석
	            .getPayload() // Claims를 가져옴
	            .getSubject(); // 토큰의 'sub'를 꺼내옮. 여기서는 employeeCode
	}
	
	// 토큰의 유효성 검사(프론트에서 API 요청을 보낼 때 토큰을 보내는데 그 토큰의 유효성 검사)
	public boolean validateToken(String token) {
	    try {
	        Jwts.parser()
	                .verifyWith(getSigningKey())
	                .build()
	                .parseSignedClaims(token);

	        return true;

	    } catch (JwtException | IllegalArgumentException e) {
	        return false;
	    }
	}

}
