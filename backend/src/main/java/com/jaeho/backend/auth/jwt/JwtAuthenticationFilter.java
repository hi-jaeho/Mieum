package com.jaeho.backend.auth.jwt;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.jaeho.backend.auth.service.CustomUserDetailsService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    /*
     * [1] JwtAuthenticationFilter의 역할
     *
     * 사용자가 로그인 후 API를 요청할 때,
     * 요청 헤더에 포함된 JWT를 검사하여
     * Spring Security에 인증 정보를 등록하는 필터.
     *
     * 전체 흐름:
     *
     * React
     *   ↓
     * HTTP 요청 (Authorization: Bearer JWT)
     *   ↓
     * JwtAuthenticationFilter
     *   ↓
     * JWT 검증
     *   ↓
     * 직원 정보 조회
     *   ↓
     * SecurityContext에 인증 정보 등록
     *   ↓
     * Controller
     *
     * 주의:
     * 실제로는 다른 Spring Security 필터들과
     * 인증 및 인가 검사를 거쳐 Controller에 도달한다.
     */


    /*
     * [2] 필요한 객체 주입
     *
     * JwtTokenProvider
     * - JWT 유효성 검증
     * - JWT에서 직원코드 추출
     *
     * CustomUserDetailsService
     * - 직원코드로 DB에서 직원 정보 조회
     * - 직원의 권한(USER, ADMIN 등) 확인
     */

    private final JwtTokenProvider jwtTokenProvider;

    private final CustomUserDetailsService customUserDetailsService;


    /*
     * [3] 생성자
     *
     * Spring이 JwtTokenProvider와
     * CustomUserDetailsService 객체를 주입한다.
     */

    public JwtAuthenticationFilter(
            JwtTokenProvider jwtTokenProvider,
            CustomUserDetailsService customUserDetailsService
    ) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.customUserDetailsService = customUserDetailsService;
    }


    /*
     * [4] doFilterInternal()
     *
     * OncePerRequestFilter를 상속하면
     * 반드시 구현해야 하는 메서드.
     *
     * 요청이 필터를 통과할 때 실행된다.
     *
     * request
     * - 클라이언트가 보낸 HTTP 요청 정보
     *
     * response
     * - 클라이언트에게 반환할 HTTP 응답 정보
     *
     * filterChain
     * - 다음 필터로 요청을 전달하는 객체
     */

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {


        /*
         * [5] Authorization 헤더 가져오기
         *
         * React에서 다음과 같이 요청했다고 가정.
         *
         * GET /api/employees
         *
         * Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
         *
         * request.getHeader("Authorization")
         * → "Bearer eyJhbGciOiJIUzI1NiJ9..."
         */

        String authorizationHeader =
                request.getHeader("Authorization");


        /*
         * [6] JWT를 저장할 변수
         *
         * 아직 토큰을 추출하지 않았으므로 null로 초기화.
         */

        String token = null;


        /*
         * [7] Bearer 토큰 추출
         *
         * 조건 1:
         * Authorization 헤더가 존재해야 한다.
         *
         * 조건 2:
         * Authorization 헤더가 "Bearer "로 시작해야 한다.
         *
         * 예:
         * "Bearer abc.def.ghi"
         *
         * substring(7)
         * → 앞의 "Bearer " 7글자를 제거한다.
         *
         * 결과:
         * "abc.def.ghi"
         */

        if (authorizationHeader != null
                && authorizationHeader.startsWith("Bearer ")) {

            token = authorizationHeader.substring(7);
        }


        /*
         * [8] JWT 유효성 검증
         *
         * 조건 1:
         * JWT가 존재해야 한다.
         *
         * 조건 2:
         * JWT가 유효해야 한다.
         *
         * validateToken()에서는 일반적으로
         * 다음 항목을 검사한다.
         *
         * - JWT 서명이 올바른가?
         * - JWT가 만료되지 않았는가?
         * - JWT 형식이 올바른가?
         *
         * 주의:
         * 실제 검증 항목은 JwtTokenProvider 구현에 따라 다르다.
         *
         * 여기서는 validateToken()이
         * 잘못된 토큰에 대해 false를 반환한다고 가정한다.
         */

        if (token != null
                && jwtTokenProvider.validateToken(token)
                && SecurityContextHolder.getContext().getAuthentication() == null) {


            /*
             * [9] JWT에서 직원코드 추출
             *
             * 로그인할 때 JWT의 subject(sub)에
             * 직원코드를 저장했다고 가정한다.
             *
             * JWT Payload 예시:
             *
             * {
             *   "sub": "S11111111",
             *   "iat": 1791590400,
             *   "exp": 1791594000
             * }
             *
             * getEmployeeCode(token)
             * → "S11111111"
             */

            String employeeCode =
                    jwtTokenProvider.getEmployeeCode(token);


            /*
             * [10] DB에서 직원 정보 조회
             *
             * JWT에 직원코드가 들어 있다고 해서
             * 해당 직원을 바로 인증하는 것은 아니다.
             *
             * 직원코드로 실제 직원 정보를 조회한다.
             *
             * 예:
             *
             * 직원코드: S11111111
             * 이름: 김철수
             * 권한: ADMIN
             *
             * CustomUserDetailsService가
             * DB에서 해당 직원 정보를 조회하고
             * UserDetails 객체로 반환한다.
             *
             * UserDetails에는 일반적으로
             * 다음 정보가 포함된다.
             *
             * - username
             * - password
             * - authorities
             * - 계정 상태
             */

            UserDetails userDetails =
                    customUserDetailsService.loadUserByUsername(employeeCode);


            /*
             * [11] Spring Security 인증 객체 생성
             *
             * UsernamePasswordAuthenticationToken은
             * 이름과 달리 JWT 인증에서도 사용할 수 있다.
             *
             * 생성자 인자:
             *
             * 첫 번째: principal
             * → 인증된 사용자 정보
             *
             * 두 번째: credentials
             * → 비밀번호 등의 인증 자격 증명
             *
             * 세 번째: authorities
             * → 사용자의 권한 목록
             *
             * 여기서는 이미 JWT를 검증했으므로
             * 비밀번호를 다시 전달하지 않는다.
             *
             * 따라서 credentials는 null.
             */

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );


            /*
             * [12] HTTP 요청의 부가 정보 저장
             *
             * WebAuthenticationDetailsSource를 이용해
             * 요청과 관련된 정보를 생성한다.
             *
             * 예:
             * - 클라이언트 IP 주소
             * - 세션 ID (존재하는 경우)
             *
             * JWT 인증의 필수 과정은 아니지만
             * 요청 정보를 인증 객체에 추가할 수 있다.
             */

            authentication.setDetails(
                    new WebAuthenticationDetailsSource()
                            .buildDetails(request)
            );


            /*
             * [13] SecurityContext에 인증 정보 등록
             *
             * Spring Security는 SecurityContext를 통해
             * 현재 요청의 인증 정보를 관리한다.
             *
             * setAuthentication(authentication)을 호출하면
             * 현재 요청을 처리하는 과정에서
             * 해당 사용자를 인증된 사용자로 인식할 수 있다.
             *
             * 예:
             *
             * 직원코드: S11111111
             * 권한: ROLE_ADMIN
             *
             * 이후 Spring Security는
             * 해당 인증 정보를 이용해
             * API 접근 권한을 검사할 수 있다.
             *
             * 주의:
             * 여기서 DB에 로그인 정보를 저장하거나
             * 새로운 JWT를 발급하는 것은 아니다.
             */

            SecurityContextHolder.getContext()
                    .setAuthentication(authentication);
        }


        /*
         * [14] 다음 필터로 요청 전달
         *
         * JWT가 유효한 경우:
         * → 인증 정보가 등록된 상태로 다음 필터 실행
         *
         * JWT가 없는 경우:
         * → 인증 정보를 등록하지 않고 다음 필터 실행
         *
         * JWT가 유효하지 않은 경우:
         * → validateToken()이 false를 반환한다면
         *   인증 정보를 등록하지 않고 다음 필터 실행
         *
         * 이후 Spring Security가
         * 해당 API의 인증 및 권한 조건을 검사한다.
         *
         * 인증이 필요한 API인데 인증 정보가 없다면
         * 접근이 거부된다.
         *
         * 따라서 이 메서드는 반드시 필요하다.
         */

        filterChain.doFilter(request, response);
    }
}