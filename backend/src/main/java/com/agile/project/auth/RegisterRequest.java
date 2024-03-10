package com.agile.project.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

//This Object/Class is to keep track of the register data
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String password;

}

/*
  When a Post Request is made this class specify that data must be sent like
{
    "firstName": "Candice",
    "lastName": "Something",
    "email": "testing@gmail.com",
    "password": "password"
}
*/
