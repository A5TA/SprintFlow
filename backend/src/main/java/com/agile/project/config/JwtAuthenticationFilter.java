package com.agile.project.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;


import java.io.IOException;

//Useful Reference: https://medium.com/@golakiyachintan24/spring-boot-jwt-authentication-with-spring-security-3-0-e9fc83d2c9cc
//This filter should be called for every request for login to examine the headers
@Component
@RequiredArgsConstructor //Makes the arg constructor for class
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    //doFilterInternal is a built-in method for the oncePerRequestFilter we simply need to analyze the request header info
    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {
        System.out.println("Preforming Authentication Filter");
        final String authenticationHeader = request.getHeader("Authorization"); //THis looks for the Bearer token
        final String jwtToken;
        final String email; //we are using emails to authenticate users but SpringBoot references this by Username

        //Invalid Request Base case
        if (authenticationHeader == null || !authenticationHeader.startsWith("Bearer ")) {
            //This means that the authHeader didn't have a token - some debugging code below
//            System.out.println("Request URI: " + request.getRequestURI());
//            System.out.println("Authorization Header: " + authenticationHeader);
            filterChain.doFilter(request, response);
            return;
        }

        jwtToken = authenticationHeader.substring(7); //This is 7 because we don't want to include Bearer in the token
        email = jwtService.getUsername(jwtToken); //This function returns the email by decoding the jwtToken

        //Check is there was an email decoded and if the user is not logged in yet
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null){
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(email); //Let's find the user by email
            //Check if the token is valid now
            if(jwtService.isTokenValid(jwtToken, userDetails)) {
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                authenticationToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        }
        filterChain.doFilter(request,response);
    }
}
