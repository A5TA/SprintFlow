package com.agile.project.controllers;

import com.agile.project.models.TaskComponents.*;
import com.agile.project.models.TeamComponents.TeamRequest;
import com.agile.project.services.TaskService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/tasks-controller") //base route to this controller
@RequiredArgsConstructor
public class TasksController {

    private final TaskService taskService;
    @GetMapping
    public ResponseEntity<String> hello() {
//        System.out.println("Started saying hello 1");
        return ResponseEntity.ok("Hello BROOOOO");
    }

    //get all the tasks for a project
    @GetMapping("/getTaskForProject/{projectId}")
    public ResponseEntity<TaskResponse> getTasksForProject(@PathVariable Integer projectId) {
        try {
            List<TaskDTO> res = taskService.getTaskForProject(projectId);
            return getTaskResponseResponseEntity(res);
        }catch (DataIntegrityViolationException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new TaskResponse(false, 0, List.of()));
        } catch (AccessDeniedException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new TaskResponse(false, 0, List.of()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new TaskResponse(false, 0, List.of()));
        }
    }

    //Get the current users tasks across all their projects
    @GetMapping("/getTasksForUser")
    public ResponseEntity<TaskResponse> getTasksForUser() {
        try {
            List<TaskDTO> res = taskService.getTasksForUser();
            return getTaskResponseResponseEntity(res);
        }catch (DataIntegrityViolationException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new TaskResponse(false, 0, List.of()));
        } catch (AccessDeniedException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new TaskResponse(false, 0, List.of()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new TaskResponse(false, 0, List.of()));
        }
    }
    //This makes it so i don't need to keep rewriting the dto code for both get tasks
    private ResponseEntity<TaskResponse> getTaskResponseResponseEntity(List<TaskDTO> res) {
//        List<TaskDTO> taskDTOs = res.stream().map(this::convertToDTO).toList();
        TaskResponse taskResponse = new TaskResponse();
        taskResponse.setSuccess(true);
        taskResponse.setCount(res.size());
        taskResponse.setData(res);
        return ResponseEntity.ok(taskResponse);
    }


    //creates a task for the project
    @PostMapping(value = "/createTaskForProject")
    public ResponseEntity<String> createTaskForProject(@RequestBody TaskRequest taskRequest) {
        try {
            String taskResponse = taskService.createTask(taskRequest);
            return ResponseEntity.ok(taskResponse);
        } catch (DataIntegrityViolationException ex) {
            //The project for the task isn't found
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    //we need a way to reassign/give a task to another user
    @PostMapping(value = "/assignTaskForUser")
    public ResponseEntity<String> assignTaskForUser(@RequestBody TaskUpdateRequest request) {
        try {
            String taskResponse = taskService.assignTask(request);
            return ResponseEntity.ok(taskResponse);
        } catch (IllegalArgumentException ex) {
            //The project for the task isn't found
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PostMapping("/modifyTaskDetails")
    public ResponseEntity<String> modifyTaskDetails(@RequestBody TaskUpdateRequest request) {
        try {
            String taskResponse = taskService.modifyTaskDetails(request);
            return ResponseEntity.ok(taskResponse);
        } catch (IllegalArgumentException ex) {
            //The project for the task isn't found
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
}
