package com.jaeho.backend.auth.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.jaeho.backend.employee.repository.EmployeeRepository;
import com.jaeho.backend.generator.EmployeeCodeGenerator;
import com.jaeho.backend.generator.PasswordGenerator;
import com.jaeho.backend.auth.dto.LoginRequest;
import com.jaeho.backend.auth.dto.SignupRequest;
import com.jaeho.backend.auth.jwt.JwtTokenProvider;
import com.jaeho.backend.employee.entity.Employee;

@Service
public class AuthService {

	private final EmployeeRepository employeeRepository;
	private final PasswordGenerator passwordGenerator;
	private final EmployeeCodeGenerator employeeCodeGenerator;
	private final PasswordEncoder passwordEncoder;
	private final EmailService emailService;
	private final AuthenticationManager authenticationManager;
	private final JwtTokenProvider jwtTokenProvider;
	
	public AuthService(EmployeeRepository employeeRepository, 
			PasswordGenerator passwordGenerator,
			EmployeeCodeGenerator employeeCodeGenerator, 
			PasswordEncoder passwordEncoder,
			EmailService emailService,
			AuthenticationManager authenticationManager,
			JwtTokenProvider jwtTokenProvider) {
		this.employeeRepository = employeeRepository;
		this.passwordGenerator = passwordGenerator;
		this.employeeCodeGenerator = employeeCodeGenerator;
		this.passwordEncoder = passwordEncoder;
		this.emailService = emailService;
		this.authenticationManager = authenticationManager;
		this.jwtTokenProvider = jwtTokenProvider;
	}

	// 로그인 성공 후에는 토큰을 반환 -> String
	public String login(LoginRequest request) {
		
		UsernamePasswordAuthenticationToken authenticationToken =
		        new UsernamePasswordAuthenticationToken(
		        		request.getEmployeeCode(),
		                request.getPassword()
		        );
		
		authenticationManager.authenticate(authenticationToken);
		
		String token = jwtTokenProvider.createToken(
				request.getEmployeeCode());
		
		return token;
	}

	public Employee register(SignupRequest request) {
		// 이메일로 중복 확인
		if(employeeRepository.existsByPhone(request.getEmail())) {
			throw new IllegalArgumentException("이미 등록된 인원입니다. 다시 한 번 확인해주세요.");
		}
		
		// 임시 비밀번호 생성
		String password = passwordGenerator.generateRandomPassword();
		
		// 임시 비밀번호 해시 처리
		String encodePw = passwordEncoder.encode(password);
		
		// 사원번호 랜덤 생성
		String employeeCode = employeeCodeGenerator.generateNumber(request.getDepartmentId());
		
		Employee employee = new Employee(
				employeeCode,
				request.getName(),
				encodePw,
				request.getDepartmentId(),
				request.getPositionId(),
				request.getEmail()
				);
		
		String mailTitle = "%s님의 임시 비밀번호 안내".formatted(employee.getName());
		
		String mailContent = """
				반갑습니다. %s님!
				
				직원코드: %s
				임시 비밀번호: %s
				
				로그인 후, 필수 입력 정보 입력과 비밀번호 변경을 부탁드립니다.
				""".formatted(
						employee.getName(),
						employeeCode,
						password
						);
		
		emailService.sendEmail(employee.getEmail(), mailTitle, mailContent);
		
		return employeeRepository.save(employee);
	}

	public void test(SignupRequest request) {
		String password = passwordGenerator.generateRandomPassword();

		System.out.println("비밀번호: " + password);

		String encodePw = passwordEncoder.encode(password);

		System.out.println("인코딩 된 비밀번호: " + encodePw);

		String employeeCode = employeeCodeGenerator.generateNumber(request.getDepartmentId());

		System.out.println("직원코드: " + employeeCode);
	}
}
