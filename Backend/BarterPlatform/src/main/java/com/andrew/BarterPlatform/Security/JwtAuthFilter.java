package com.andrew.BarterPlatform.Security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter{

	private final JwtUtil jwtUtil;
	private final CustomUserDetailsService userService;

	 @Override
	 protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
			 FilterChain chain) throws ServletException, JwtException, IOException {
		 
		 String header = request.getHeader("Authorization");
		 String token = null;
		 String email = null;
		 
		 if(header!=null && header.startsWith("Bearer ")) {
			 token = header.substring(7);
			 try {
			 	email = jwtUtil.extractEmail(token);
			 	System.out.println("DEBUG: Extracted email: " + email + " for request: " + request.getRequestURI());
			 } catch (Exception e) {
			 	System.out.println("DEBUG: Failed to extract email from token: " + e.getMessage());
			 }
		 }
		 
		 if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
			 UserDetails userDetails = userService.loadUserByUsername(email);
			 
			 if(jwtUtil.validateToken(token)) {
				 UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
				 System.out.println("DEBUG: Authenticated user: " + email + " with authorities: " + userDetails.getAuthorities());
				 authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
				 SecurityContextHolder.getContext().setAuthentication(authToken);
			 } else {
			 	System.out.println("DEBUG: JWT Validation failed for token of user: " + email);
			 }
			 
		 }
		 chain.doFilter(request, response);

	 }
}
