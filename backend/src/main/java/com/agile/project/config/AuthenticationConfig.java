package com.agile.project.config;

import com.agile.project.models.UserComponents.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;


/*
Due to the new updates for Spring Boot I can simplify some services by combining them into one config file
* */

@Configuration
@RequiredArgsConstructor
public class AuthenticationConfig {

    private final UserRepository repository;

    //This Method is a service for the JwtAuthenticationFilter - I removed my UserDetailsService class and made this method so the code is simpler
    @Bean
    public UserDetailsService userDetailsService() {
        return username ->  repository.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException("User Now found with username: " + username ));
    }

    //This is responsible for data fetching the userDetails etc
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userDetailsService());
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        return authenticationProvider;
    }

    //This Bean returns the Encryption method
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    //The AuthenticationManager manages the authentication, so we need to add the bean
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }


}
