package com.andrew.BarterPlatform.Dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {

	private String username;
	private String email;
	private String password;
	private String profileName;
	private String bio;
	private List<String> preferences;
	
}
