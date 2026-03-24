package com.andrew.BarterPlatform.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable = false, unique = true)
	private String username;
	
	@Column(nullable = false, unique = true)
	private String email;
	
	@Column(nullable = false)
	private String password;
	
	private String profileName;
	private String bio;
	private Integer credits = 10;
	
	@Column(name = "average_rating")
	private Double averageRating = 0.0;
	
	@Column(name = "total_ratings")
	private Integer totalRatings = 0;

	@Column(name = "avatar_url")
	private String avatarUrl;

	public User(String username, String email, String password, String profileName, String bio) {
		this.username = username;
		this.email = email;
		this.password = password;
		this.profileName = profileName;
		this.bio = bio;
	}
}
