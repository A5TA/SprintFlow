package com.agile.project.models.TeamComponents;

import com.agile.project.models.UserComponents.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Set;

public interface TeamRepository extends JpaRepository<Team, Integer> {
    Team findByName(String name);

    @Query("SELECT t.users FROM Team t WHERE t.name = :teamName") //select all the users from team where the team is called teamName
    Set<User> findAllUsersByTeamName(@Param("teamName") String teamName);
}
