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
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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
        Project project = projectRepository.findById(taskRequest.getProjectId()).orElseThrow(() -> new IllegalArgumentException("Project not found with id " + taskRequest.getProjectId()));; //we need to make sure the team exists

        //build the new task
        Task task = Task.builder()
                .name(taskRequest.getName())
                .description(taskRequest.getDesc())
                .points(taskRequest.getPoints())
                .startDate(taskRequest.getStartDate())
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
    public List<TaskDTO> getTaskForProject(Integer projectId) {
        try {
            //we need to look up the project by id so that it throws an error if this projectid doesn't exist
            Project project = projectRepository.findById(projectId).orElseThrow(() -> new DataIntegrityViolationException("Project with ID '" + projectId + "' not found"));;

            List<Task> tasks = taskRepository.findByProjectId(projectId);
            if (tasks == null) {
                return List.of();
            }
            // Create a new list to store tasks with user's email added
            List<TaskDTO> tasksWithUserEmail = new ArrayList<>();
            for (Task task : tasks) {
                TaskDTO taskDTO = convertToDTO(task, task.getUser().getEmail()); //Make the new DTO with the users email
                tasksWithUserEmail.add(taskDTO);
            }
            return tasksWithUserEmail;
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
        if (request.getStartDate() != null) {
            task.setStartDate(request.getStartDate());
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

    public List<TaskDTO> getTasksForUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        try {
            List<Task> tasks = taskRepository.findByUser(user);
            if (tasks == null) {
                return List.of();
            }
            // Create a new list to store tasks with user's email added
            List<TaskDTO> tasksWithUserEmail = new ArrayList<>();
            for (Task task : tasks) {
                TaskDTO taskDTO = convertToDTO(task, user.getEmail()); //there is only 1 email for this since its the same user
                tasksWithUserEmail.add(taskDTO);
            }
            return tasksWithUserEmail;
        } catch (DataIntegrityViolationException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new RuntimeException("Error retrieving tasks for project: " + ex.getMessage(), ex);
        }

    }


    //This method converts the Entity object for a Task to a DTO so that it can be viewed properly in the json res
    private TaskDTO convertToDTO(Task task, String userEmail) {
        return TaskDTO.builder()
                .id(task.getId())
                .name(task.getName())
                .description(task.getDescription())
                .startDate(task.getStartDate())
                .dueDate(task.getDueDate())
                .points(task.getPoints())
                .taskStatus(task.getTaskStatus())
                .userId(task.getUser().getId()) // Assuming getId() returns the user's ID
                .projectId(task.getProject().getId()) // Assuming getId() returns the project's ID
                .assignedTO(userEmail) //This is the email that the task is assigned to
                .build();
    }
}
