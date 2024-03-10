package com.agile.project.models.TeamComponents;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamRepository extends JpaRepository<Team, Integer> {
    Team findByName(String name);
}
