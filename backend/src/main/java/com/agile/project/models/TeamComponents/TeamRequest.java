package com.agile.project.models.TeamComponents;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

//structure for requests to build a team
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class TeamRequest {
    private String name;
}
