package com.agile.project.services;

import com.agile.project.auth.AuthenticationResponse;
import com.agile.project.models.TeamComponents.Team;
import com.agile.project.models.TeamComponents.TeamRepository;
import com.agile.project.models.TeamComponents.TeamRequest;
import com.agile.project.models.UserComponents.User;
import com.agile.project.models.UserComponents.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class TeamService {
    //we need to access the repository
    private final UserRepository repository;
    private final TeamRepository teamRepository;

    @Transactional // This prevents Lazy Loading errors
    public Optional<User> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        return repository.findByEmail(userEmail);
    }


    //This service method will create a Team and add relate it to the user
    @Transactional // This prevents Lazy Loading errors
    public String createTeam(TeamRequest teamRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        User user = repository.findByEmail(userEmail).orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Team team = Team.builder()
                .name(teamRequest.getName())
                .build();

        try {
            //we need to get the current teams the user has then add the new team to them and update both the mapping repo and team repo
            Set<Team> teamSet = user.getTeams();
            teamSet.add(team);
            user.setTeams(teamSet);
            teamRepository.save(team);
            return "The Team with name " + team.getName() + " has been created!";
        } catch (DataIntegrityViolationException ex) {
            throw new DataIntegrityViolationException("Team name already in use");
        }
    }

    @Transactional // This prevents Lazy Loading errors
    public String addToTeam(String teamName) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        User user = repository.findByEmail(userEmail).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        try {
            Team team = teamRepository.findByName(teamName);
            //we need to get the current teams the user has then added the new team to them and update both the mapping repo and team repo
            Set<Team> teamSet = user.getTeams();
            teamSet.add(team);
            user.setTeams(teamSet);
            return "The User " + user.getFirstName() + " " + user.getLastName() + " joined the team " + team.getName();
        } catch (NullPointerException ex) {
            throw new DataIntegrityViolationException("Team name doesn't exist");
        }
    }


}
