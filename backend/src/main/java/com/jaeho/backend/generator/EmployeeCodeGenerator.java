package com.jaeho.backend.generator;

import java.util.concurrent.ThreadLocalRandom;

import org.springframework.stereotype.Component;

@Component
public class EmployeeCodeGenerator {
	public String generateNumber(int departmentId) {
		char alphabet = 'X';
		
		switch(departmentId){		
		case 1: // 인사부(H)
			alphabet = 'H';
			break;
		case 2: // IT부(I)
			alphabet = 'I';
			break;
		case 3: // 영업부(S)
			alphabet = 'S';
			break;
		case 4: // 운영부(O)
			alphabet = 'O';
			break;
		default:
			break;
		}
		
        // 10,000,000 이상 100,000,000 미만의 무작위 수 생성
        int randomNumber = ThreadLocalRandom.current().nextInt(10000000, 100000000);
        
        String employeeCode = alphabet + String.valueOf(randomNumber);
        
        return employeeCode;
    }
}
