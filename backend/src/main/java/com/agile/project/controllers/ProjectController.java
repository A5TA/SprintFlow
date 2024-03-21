package com.agile.project.controllers;


import com.agile.project.models.ProjectComponents.Project;
import com.agile.project.models.ProjectComponents.ProjectDTO;
import com.agile.project.models.ProjectComponents.ProjectRequest;
import com.agile.project.models.ProjectComponents.ProjectResponse;
import com.agile.project.models.TaskComponents.Task;
import com.agile.project.models.TaskComponents.TaskDTO;
import com.agile.project.models.TaskComponents.TaskResponse;
import com.agile.project.services.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping(value = "/getAllProjectsForTeam/{teamName}")
    public ResponseEntity<ProjectResponse> getAllProjectsForTeam(@PathVariable String teamName) {
        try {
            List<Project> res = projectService.getAllProjectsForTeam(teamName);
            return getProjectsResponseResponseEntity(res);
        }catch (DataIntegrityViolationException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ProjectResponse(false, 0, List.of()));
        } catch (AccessDeniedException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ProjectResponse(false, 0, List.of()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ProjectResponse(false, 0, List.of()));
        }
    }

    private ResponseEntity<ProjectResponse> getProjectsResponseResponseEntity(List<Project> res) {
        List<ProjectDTO> projectDTOS = res.stream().map(this::convertToDTO).toList();
        ProjectResponse projectResponse = new ProjectResponse();
        projectResponse.setSuccess(true);
        projectResponse.setCount(res.size());
        projectResponse.setData(projectDTOS);
        return ResponseEntity.ok(projectResponse);
    }

    //This method converts the Entity object for a Project to a DTO so that it can be viewed properly in the json res
    private ProjectDTO convertToDTO(Project project) {
        return ProjectDTO.builder()
                .id(project.getId())
                .name(project.getName())
                .startDate(project.getStartDate())
                .endDate(project.getEndDate())
                .teamId(project.getTeam().getId())
                .build();
    }
}
