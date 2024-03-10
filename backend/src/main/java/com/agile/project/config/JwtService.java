package com.agile.project.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

//This implementation is the standard for all Jwt Services currently
//UseFul Reference: https://medium.com/spring-boot/spring-boot-3-spring-security-6-jwt-authentication-authorization-98702d6313a5
@Service //This is a service, so we should use the service bean
public class JwtService {
    private static final String JWT_SECRET = "oYy7GYrtACNAPZjhAla9Xx2Ftt1vBDZyCu5cIYzsQcqm23h+U5Ns+lyrrEt1s2Ji";

    public String getUsername(String jwtToken) {
        return getClaim(jwtToken, Claims::getSubject);
    }

    //This method extracts a single claim using the token
    public <T> T getClaim(String jwtToken, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaims(jwtToken);
        return claimsResolver.apply(claims);
    }

    //Method overloading because there is two use cases for when we generate the token
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }
    public String generateToken(
            Map<String ,Object> claims,
            UserDetails userDetails
    ) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername()) //We set the email as the username in the userDetails in User.java
                .setIssuedAt(new Date(System.currentTimeMillis())) //We need timestamps when working with tokens since they should expire after a certain time
                .setExpiration(new Date(System.currentTimeMillis()+1000 * 60 * 24)) //Toke will last 1 day
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }
    //we need to check if the token corresponds to the user details
    public boolean isTokenValid(String jwtToken, UserDetails userDetails) {
        final String username = getUsername(jwtToken);
        //compare userDetails and check if token expired
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(jwtToken));
    }

    public Date getExpiration(String token) {
        return getClaim(token, Claims::getExpiration);
    }

    private boolean isTokenExpired(String jwtToken) {
        return getExpiration(jwtToken).before(new Date());
    }


    private Claims getAllClaims(String jwtToken) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(jwtToken)
                .getBody();
    }

    //This is the secret that ensures the data is encrypted and protected
    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(JWT_SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
