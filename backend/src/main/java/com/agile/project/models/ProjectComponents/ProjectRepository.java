package com.agile.project.models.ProjectComponents;

import com.agile.project.models.TeamComponents.Team;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Integer> {
    List<Project> findByTeam(Team team);
    Project findByName(String name);
}
