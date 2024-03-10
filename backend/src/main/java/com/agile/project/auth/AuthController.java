package com.agile.project.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


//Useful reference to making endpoints: https://medium.com/@abhinavv.singh/implementing-user-authentication-in-a-spring-boot-application-a-detailed-step-by-step-guide-b15a9877569b
@RestController
@RequestMapping("/api/v1/auth") //base route to this controller
@RequiredArgsConstructor //If you are wondering why this is here it makes it easier to inject the services because they use the singleton pattern, so they aren't being instantiated multiple times using New
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) {
        /* Before this is called There is a JwtAuthenticationFilter used because in the SecurityConfiguration
        * We made the filter run for all requests to this path '/api/v1/auth/**'
        *  So Here is the Sequence of steps after security is configured:
        *  User Post Request -> JwtAuthenticationFilter(This will fail because it is registration)
        *  -> This classes register method -> AuthService register logic -> UserRepository(saving the new user object)
        *  -> Then finally the String with the token is returned to be sent back as a Json response
        *
        * */
        System.out.println("TIME TO REGISTER");
        try {
            AuthenticationResponse authenticationResponse = authService.register(request);
            return ResponseEntity.ok(authenticationResponse);
        } catch (IllegalArgumentException ex) {
            //we want to throw a bad request if the registration isn't how we want it yk
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (DataIntegrityViolationException ex) {
            //we want to throw a Conflict because there is duplicate emails if the registration isn't how we want it yk
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }

    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody LoginRequest request){
        try {
            AuthenticationResponse authenticationResponse = authService.login(request);
            return ResponseEntity.ok(authenticationResponse);
        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }
}
