package com.agile.project.models.TaskComponents;

import com.agile.project.models.ProjectComponents.Project;
import com.agile.project.models.UserComponents.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task,Integer> {
    List<Task> findByProjectId(Integer projectId);
    List<Task> findByUser(User user);
}
