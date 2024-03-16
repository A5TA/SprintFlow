package com.agile.project.models.ProjectComponents;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class ProjectRequest {
    String name;
    Date startDate;
    Date endDate;
    String teamName;
}
