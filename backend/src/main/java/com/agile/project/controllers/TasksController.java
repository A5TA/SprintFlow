package com.agile.project.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/tasks-controller") //base route to this controller
public class TasksController {

    @GetMapping
    public ResponseEntity<String> hello() {
//        System.out.println("Started saying hello 1");
        return ResponseEntity.ok("Hello BROOOOO");
    }
}
