package com.andrew.BarterPlatform.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import jakarta.annotation.PostConstruct;

import com.andrew.BarterPlatform.Service.UserService;
import com.andrew.BarterPlatform.Dto.UserDto;
import com.andrew.BarterPlatform.Entity.User;
import com.andrew.BarterPlatform.Repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {

	private final UserService userService;
	private final UserRepository userRepository;
	
	private final Path fileStorageLocation = Paths.get("uploads/avatars").toAbsolutePath().normalize();

	@PostConstruct
	public void init() {
		try {
			Files.createDirectories(this.fileStorageLocation);
		} catch (Exception ex) {
			throw new RuntimeException("Could not create directory where uploaded files will be stored.", ex);
		}
	}
	
	@GetMapping("/me")
	public ResponseEntity<User> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
	    String email = userDetails.getUsername();
	    User user = userService.findByEmail(email);
	    return ResponseEntity.ok(user);
	}
	
	@PostMapping
	public ResponseEntity<User> createUser(@RequestBody UserDto userDto) {
		User user = userService.createUser(userDto);
		return new ResponseEntity<>(user, HttpStatus.CREATED);
	}
	
	@GetMapping
	public ResponseEntity<List<User>> getUsers() {
		List<User> users = userService.getUsers();
		return new ResponseEntity<>(users, HttpStatus.OK);
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<User> getUserById(@PathVariable Long id) {
		User user = userService.getUserById(id);
		return new ResponseEntity<>(user, HttpStatus.OK);
	}
	
	
	@PutMapping("/{id}")
	public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody UserDto userDto) {
		User user = userService.updateUser(id, userDto);
		return new ResponseEntity<>(user, HttpStatus.OK);
	}
	
	@PostMapping("/{id}/avatar")
	public ResponseEntity<User> uploadAvatar(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
		User user = userRepository.findById(id).orElse(null);
		if (user == null) return ResponseEntity.notFound().build();
		try {
			String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename().replaceAll("[^a-zA-Z0-9\\.\\-]", "_");
			Path targetLocation = this.fileStorageLocation.resolve(fileName);
			Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
			
			user.setAvatarUrl("/users/avatar/" + fileName);
			userRepository.save(user);
			return ResponseEntity.ok(user);
		} catch (Exception ex) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
	
	@GetMapping("/avatar/{fileName:.+}")
	public ResponseEntity<Resource> getAvatar(@PathVariable String fileName) {
		try {
			Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
			Resource resource = new UrlResource(filePath.toUri());
			if (resource.exists()) {
				String contentType = Files.probeContentType(filePath);
				if (contentType == null) contentType = "application/octet-stream";
				return ResponseEntity.ok()
						.contentType(MediaType.parseMediaType(contentType))
						.body(resource);
			}
		} catch (Exception ex) {}
		return ResponseEntity.notFound().build();
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
		userService.deleteUser(id);
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}
}
