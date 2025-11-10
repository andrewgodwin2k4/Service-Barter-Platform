package com.andrew.BarterPlatform.Service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.andrew.BarterPlatform.Dto.UserDto;
import com.andrew.BarterPlatform.Entity.User;
import com.andrew.BarterPlatform.Repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

	private final UserRepository userRepo;
	private final PasswordEncoder passwordEncoder;
	
	public List<User> getUsers() {
		return userRepo.findAll();
	} 
	
	public User getUserById(Long id) {
		return userRepo.findById(id).orElseThrow(()-> new EntityNotFoundException("User not Found!"));
	}
	
	public User createUser(UserDto userDto) {
		
		if (userRepo.findByEmail(userDto.getEmail()).isPresent()) 
			throw new IllegalArgumentException("Email already exists!");
		if (userRepo.findByUsername(userDto.getUsername()).isPresent()) 
			throw new IllegalArgumentException("Username already exists!");
		
		
		User user = new User(
			userDto.getUsername().trim(), 
			userDto.getEmail().trim(),
			passwordEncoder.encode(userDto.getPassword().trim()), 
			userDto.getProfileName().trim(), 
			userDto.getBio().trim()
		);
		return userRepo.save(user);
		
	}
	
	public User updateUser(Long id, UserDto userDto) {
		
		User user = userRepo.findById(id).orElseThrow(()-> new EntityNotFoundException("User not Found!"));
		user.setUsername(userDto.getUsername());
		user.setEmail(userDto.getEmail());
		if (userDto.getPassword() != null && !userDto.getPassword().isBlank()) {
		    user.setPassword(passwordEncoder.encode(userDto.getPassword()));
		}
		user.setProfileName(userDto.getProfileName());
		user.setBio(userDto.getBio());
		return userRepo.save(user);
		
	}
	
	public void deleteUser(Long id) {
		User user = userRepo.findById(id).orElseThrow(()-> new EntityNotFoundException("User not Found!"));
		userRepo.delete(user);
	}
}
