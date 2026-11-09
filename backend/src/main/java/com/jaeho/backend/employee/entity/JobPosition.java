package com.jaeho.backend.employee.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "JOB_POSITION")
public class JobPosition {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "POSITION_ID")
	private Integer positionId;
	
	@Column(name = "POSITION_NAME", nullable = false)
	private String positionName;
	
	protected JobPosition() {}

	public JobPosition(Integer positionId, String positionName) {
		super();
		this.positionId = positionId;
		this.positionName = positionName;
	}

	public Integer getPositionId() {
		return positionId;
	}

	public String getPositionName() {
		return positionName;
	}
}	
