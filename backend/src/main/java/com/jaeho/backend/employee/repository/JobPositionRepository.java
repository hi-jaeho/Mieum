package com.jaeho.backend.employee.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jaeho.backend.employee.entity.JobPosition;

public interface JobPositionRepository extends JpaRepository<JobPosition, Integer>{

}
