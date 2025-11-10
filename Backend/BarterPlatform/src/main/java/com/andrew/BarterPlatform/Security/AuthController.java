package com.andrew.BarterPlatform.Security;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.andrew.BarterPlatform.Dto.UserDto;
import com.andrew.BarterPlatform.Entity.User;
import com.andrew.BarterPlatform.Service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

	private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;
    private final UserService userService;
    
    @PostMapping("/register")
	public ResponseEntity<User> createUser(@RequestBody UserDto userDto) {
		User user = userService.createUser(userDto);
		return new ResponseEntity<>(user, HttpStatus.CREATED);
	}
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        authManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));

        String token = jwtUtil.generateToken(email);
        return ResponseEntity.ok(Map.of("token", token));
    }
	
}
