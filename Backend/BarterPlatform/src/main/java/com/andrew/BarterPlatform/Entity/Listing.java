package com.andrew.BarterPlatform.Entity;

import com.andrew.BarterPlatform.Enum.SkillCategory;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "listings")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Listing {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable = false)
	private String title;
	
	private String description;
	
	@Column(nullable = false)
	private SkillCategory category;
	
	@Column(nullable = false)
	private Integer creditValue;
	
	@ManyToOne
	@JoinColumn(name = "user_id", nullable = false)
	private User owner;
	
}
