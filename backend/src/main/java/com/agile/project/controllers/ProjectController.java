package com.agile.project.controllers;


import com.agile.project.models.ProjectComponents.ProjectRequest;
import com.agile.project.services.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/project-controller") //base route to this controller
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping(value = "/createProject")
    public ResponseEntity<String> createProject(@RequestBody ProjectRequest projectRequest) {
        try {
            String projectResponse = projectService.createProject(projectRequest);
            return ResponseEntity.ok(projectResponse);
        } catch (DataIntegrityViolationException ex) {
            //we want to throw a not found if there is no team with that name to make the project
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
}
