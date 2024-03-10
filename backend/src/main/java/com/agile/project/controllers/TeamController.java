package com.agile.project.controllers;

import com.agile.project.models.TeamComponents.TeamRequest;
import com.agile.project.services.TeamService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @Transactional
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
}
