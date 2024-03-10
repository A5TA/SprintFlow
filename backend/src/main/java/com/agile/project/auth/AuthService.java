package com.agile.project.auth;

import com.agile.project.config.JwtService;
import com.agile.project.models.UserComponents.Role;
import com.agile.project.models.UserComponents.User;
import com.agile.project.models.UserComponents.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    //we need to access the repository
    private final UserRepository repository;
    //we need to encrypt the password on registration so lets import it
    private final PasswordEncoder passwordEncoder;

    //We want to return a token so the user can re-access the site without the need to login everytime
    private final JwtService jwtService;

    private final AuthenticationManager authenticationManager;
    public AuthenticationResponse register(RegisterRequest request) {
        System.out.println("Started Registering The User " + request.getFirstName());
        //Check if the password is not none
        String pass = request.getPassword();
        String email = request.getEmail();
        //Throw an error if the password is less than 6 characters
        if (pass.length() < 6 || !email.contains("@") ) {
            throw new IllegalArgumentException();
        }
        //Create a User Object using the request body - This is builder pattern
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();
        //we need to see if there is already an email in use so lets test with try catch since we are using the column @ for the sql to remove it automatically
        try {
            repository.save(user); //save the user object just created this will fail if duplicate emails
            String jwtToken = jwtService.generateToken(user);
            return AuthenticationResponse.builder()
                    .token(jwtToken)
                    .build();
        } catch (DataIntegrityViolationException ex) {
            throw new DataIntegrityViolationException("Email already in use");
        }
    }

    //Useful Reference: https://www.tabnine.com/code/java/methods/org.springframework.security.authentication.AuthenticationManager/authenticate
    // and https://stackoverflow.com/questions/9787409/what-is-the-default-authenticationmanager-in-spring-security-how-does-it-authen
    public AuthenticationResponse login(LoginRequest request)  {
//        System.out.println("Testing Login");
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
        );
//        System.out.println("Testing Login 2 : " + authenticationToken);
        /*
        The .authenticate is passing the authenticationToken to the AuthenticationProvider,
        which will use the userDetailsService to get the user based on username/email and compare that user's
         password with the one in the authentication token.
        * */
        try {
            Authentication authentication = authenticationManager.authenticate(authenticationToken);

            // Authentication successful, retrieve the authenticated user details
            User user = (User) authentication.getPrincipal(); //we are fetching the principle which is all their data
//          System.out.println("the user is " + user);
            String jwtToken = jwtService.generateToken(user);

            return AuthenticationResponse.builder()
                    .token(jwtToken)
                    .build();

        } catch (BadCredentialsException ex) {
            System.out.println("Invalid Authentication");
            throw new BadCredentialsException("Invalid Authentication Request");

        } catch (AuthenticationException ex) {
            throw new BadCredentialsException("Something Went Wrong Authenticating you");
        }

        //I could implement the disabled and locked exception but that is outside the scope of this project
    }
}
