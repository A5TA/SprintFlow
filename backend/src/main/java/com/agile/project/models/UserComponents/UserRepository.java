package com.agile.project.models.UserComponents;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    //we need a way to find users by email
    Optional<User> findByEmail(String email);
}
