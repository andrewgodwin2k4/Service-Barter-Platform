package com.andrew.BarterPlatform.Security;

import java.security.Key;
import java.util.Date;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

	private static final String secretKey = "thisistheusersecretkeythatisatleast256bitsforencoding";
	private static final long expiryTime = 86400000;
	
	private final Key key = Keys.hmacShaKeyFor(secretKey.getBytes());
	
	public String generateToken(String email) {
		return Jwts.builder()
				.setSubject(email)
				.setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + expiryTime))
				.signWith(key, SignatureAlgorithm.HS256)
				.compact();
	}
	
	public String extractEmail(String token) {
	    return Jwts.parserBuilder()
	    		.setSigningKey(key)
	    		.build()
	            .parseClaimsJws(token)
	            .getBody()
	            .getSubject();
	}
	
	public boolean validateToken(String token) {
	    try {
	        Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
	        return true;
	    } catch (JwtException e) {
	        return false;
	    }
	}


}
