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
    @GetMapping("/getTaskForProject/{projectName}")
    public ResponseEntity<TaskResponse> getTasksForProject(@PathVariable String projectName) {
        try {
            List<Task> res = taskService.getTaskForProject(projectName);
            List<TaskDTO> taskDTOs = res.stream().map(this::convertToDTO).toList();
            TaskResponse taskResponse = new TaskResponse();
            taskResponse.setSuccess(true);
            taskResponse.setCount(res.size());
            taskResponse.setData(taskDTOs);
            return ResponseEntity.ok(taskResponse);
        }catch (DataIntegrityViolationException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new TaskResponse(false, 0, List.of()));
        } catch (AccessDeniedException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new TaskResponse(false, 0, List.of()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new TaskResponse(false, 0, List.of()));
        }
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

    //This method converts the Entity object for a Task to a DTO so that it can be viewed properly in the json res
    private TaskDTO convertToDTO(Task task) {
        return TaskDTO.builder()
                .id(task.getId())
                .name(task.getName())
                .description(task.getDescription())
                .dueDate(task.getDueDate())
                .points(task.getPoints())
                .taskStatus(task.getTaskStatus())
                .userId(task.getUser().getId()) // Assuming getId() returns the user's ID
                .projectId(task.getProject().getId()) // Assuming getId() returns the project's ID
                .build();
    }
}
