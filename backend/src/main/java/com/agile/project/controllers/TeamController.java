package com.agile.project.controllers;

import com.agile.project.models.ProjectComponents.Project;
import com.agile.project.models.ProjectComponents.ProjectDTO;
import com.agile.project.models.ProjectComponents.ProjectResponse;
import com.agile.project.models.TeamComponents.Team;
import com.agile.project.models.TeamComponents.TeamRequest;
import com.agile.project.models.TeamComponents.TeamResponse;
import com.agile.project.services.TeamService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/team-controller") //base route to this controller
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;

    //This will build a team using the user that made the request as the leader
    @PostMapping(value = "/createTeamFromUser")
    public ResponseEntity<String> createTeamFromUser(@RequestBody TeamRequest teamRequest) {
        try {
            String teamResponse = teamService.createTeam(teamRequest);
            return ResponseEntity.ok(teamResponse);
        } catch (DataIntegrityViolationException ex) {
        //we want to throw a Conflict because there is duplicate names
        return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }
    }

    @PostMapping(value = "/addUserToTeam/{teamName}")
    public ResponseEntity<String> saveUserWithTeam(@PathVariable String teamName) {
        try {
            String addResponse = teamService.addToTeam(teamName);
            return ResponseEntity.ok(addResponse);
        } catch (DataIntegrityViolationException ex) {
            //we want to throw a Conflict because there is duplicate names
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    private ResponseEntity<TeamResponse> getTeamsResponseResponseEntity(List<Team> res) {
        List<String> teamNames = res.stream()
                .map(Team::getName)
                .toList();
        TeamResponse teamResponse = new TeamResponse();
        teamResponse.setSuccess(true);
        teamResponse.setCount(res.size());
        teamResponse.setData(teamNames);
        return ResponseEntity.ok(teamResponse);
    }

    //TODO: GetALLTeams
    @GetMapping(value="/getAllTeams")
    public ResponseEntity<TeamResponse> getAllTeams() {
        List<Team> teamsResponse = teamService.getAllTeams();
        return getTeamsResponseResponseEntity(teamsResponse);
    }
    //TODO:GetALLTeamsForUser
    @GetMapping(value="/getAllTeamsForUser")
    public ResponseEntity<TeamResponse> getAllTeamsForUser() {
        try {
            List<Team> teamsResponse = teamService.getAllTeamsForUser();
            return getTeamsResponseResponseEntity(teamsResponse);
        }
        catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new TeamResponse(false, 0, List.of()));
        }
    }
}
