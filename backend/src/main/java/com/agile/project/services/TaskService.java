package com.agile.project.services;

import com.agile.project.models.ProjectComponents.Project;
import com.agile.project.models.ProjectComponents.ProjectRepository;
import com.agile.project.models.TaskComponents.*;
import com.agile.project.models.UserComponents.User;
import com.agile.project.models.UserComponents.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final ProjectRepository projectRepository; //we need to save new tasks to the project db
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    @Transactional // This prevents Lazy Loading errors, Method creates a project for a given team in the proj req
    public String createTask(TaskRequest taskRequest) {
        Optional<User> currentUserOptional = getCurrentUser();
        User currentUser = currentUserOptional.orElseThrow(() -> new IllegalStateException("Current user not found"));

        //confirm the project exists before making a tasks for it
        Project project = projectRepository.findByName(taskRequest.getProjectName()); //we need to make sure the team exists
        if (project == null) {
            throw new DataIntegrityViolationException("Project with name '" + taskRequest.getProjectName() + "' not found");
        }

        //build the new task
        Task task = Task.builder()
                .name(taskRequest.getName())
                .description(taskRequest.getDesc())
                .points(taskRequest.getPoints())
                .dueDate(taskRequest.getDueDate())
                .taskStatus(TaskStatus.NOTSTARTED)
                .user(currentUser) //this task is being created not assigned yet
                .build();

        try {
            //The task is made lets add it to the project
            project.getTasks().add(task);
            task.setProject(project);
            taskRepository.save(task);
            return "The Task with name " + taskRequest.getName() + " has been created!";
        } catch (DataIntegrityViolationException ex) {
            throw new DataIntegrityViolationException("Error has occured");
        }

    }
    @Transactional
    public List<Task> getTaskForProject(String projectName) {
        try {
            Project project = projectRepository.findByName(projectName);
            if (project == null) {
                throw new DataIntegrityViolationException("Project with name '" + projectName + "' not found");
            }
            List<Task> tasks = taskRepository.findByProjectName(projectName);
            if (tasks == null) {
                return List.of();
            }
//            System.out.println(tasks);
            return new ArrayList<>(tasks);
        } catch (DataIntegrityViolationException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new RuntimeException("Error retrieving tasks for project: " + ex.getMessage(), ex);
        }
    }

    @Transactional
    public Optional<User> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        return userRepository.findByEmail(userEmail);
    }

    @Transactional
    public String assignTask(TaskUpdateRequest request) {
        //we need to find the user in the request then change the properties of that Task object by the id provided

        // Find the user in the request using the email in the request
        Optional<User> userOptional = userRepository.findByEmail(request.getAssignEmail());
        User user = userOptional.orElseThrow(() -> new IllegalArgumentException("Assignable user not found"));

        // locate the task using the requst id
        Optional<Task> taskOptional = taskRepository.findById(request.getTaskId());
        Task task = taskOptional.orElseThrow(() -> new IllegalArgumentException("Task not found with id " + request.getTaskId()));

        // Modify/Update the task with the user id
        task.setUser(user);

        // Save the modified task
        taskRepository.save(task);

        return "Task assigned successfully to user with ID: " + user.getId();
    }

    @Transactional
    public String modifyTaskDetails(TaskUpdateRequest request) {

        // locate the task using the request id
        Optional<Task> taskOptional = taskRepository.findById(request.getTaskId());
        Task task = taskOptional.orElseThrow(() -> new IllegalArgumentException("Task not found with id " + request.getTaskId()));

        // Only Update the task attributes that are included in the request body
        //validate the status so that it is like the enum I made
        if (request.getTaskStatus() != null && !request.getTaskStatus().isEmpty()) {
            TaskStatus taskStatus = convertToTaskStatus(request.getTaskStatus().trim());
            task.setTaskStatus(taskStatus);
        }

        if (request.getName() != null && !request.getName().isEmpty()) {
            task.setName(request.getName());
        }
        if (request.getDesc() != null && !request.getDesc().isEmpty()) {
            task.setDescription(request.getDesc());
        }
        if (request.getDueDate() != null) {
            task.setDueDate(request.getDueDate());
        }
        if (request.getPoints() > 0) {
            task.setPoints(request.getPoints());
        }

        // Save the modified task
        taskRepository.save(task);

        return "Task has been updated";
    }

    //necessary method to make the string for task status into an enum for the database
    private TaskStatus convertToTaskStatus(String status) {
        try {
            return TaskStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid task status: " + status);
        }
    }
}
