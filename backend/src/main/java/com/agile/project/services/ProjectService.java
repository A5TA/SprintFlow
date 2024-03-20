package com.agile.project.services;

import com.agile.project.models.ProjectComponents.Project;
import com.agile.project.models.ProjectComponents.ProjectRepository;
import com.agile.project.models.ProjectComponents.ProjectRequest;
import com.agile.project.models.TeamComponents.Team;
import com.agile.project.models.TeamComponents.TeamRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
@RequiredArgsConstructor
public class ProjectService {

    private final TeamRepository teamRepository; //we need the team repo to add new projects
    private final ProjectRepository projectRepository; //we need to save new projects here

    @Transactional // This prevents Lazy Loading errors, Method creates a project for a given team in the proj req
    public String createProject(ProjectRequest projectRequest) {
        Team team = teamRepository.findByName(projectRequest.getTeamName()); //we need to make sure the team exists
        if (team == null) {
            throw new DataIntegrityViolationException("Team with name '" + projectRequest.getTeamName() + "' not found");
        }

        //Logic to make sure there aren't duplicate projects in a team
        List<Project> projects = projectRepository.findByTeam(team);
        boolean projectExists = projects.stream()
                .anyMatch(project -> project.getName().equals(projectRequest.getName()));
        if (projectExists) {
            throw new DataIntegrityViolationException("Project with name '" + projectRequest.getName() + "' already exists for team '" + team.getName() + "'");
        }

        //Time to create project object
        Project project = Project.builder()
                .name(projectRequest.getName())
                .startDate(projectRequest.getStartDate())
                .endDate(projectRequest.getEndDate())
                .team(team)
                .build();

        try {
            //we need to get the current teams the user has then added the new team to them and update both the mapping repo and team repo
            team.getProjects().add(project);
            projectRepository.save(project); //save the new project to the database
            return "The Project with name " + projectRequest.getName() + " has been created!";
        } catch (DataIntegrityViolationException ex) {
            throw new DataIntegrityViolationException("Project with this name already made");
        }
    }
}
