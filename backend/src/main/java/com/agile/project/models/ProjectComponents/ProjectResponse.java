package com.agile.project.models.ProjectComponents;

import com.agile.project.models.TaskComponents.TaskDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectResponse {
    private Boolean success;
    private int count;
    private List<ProjectDTO> data;
}
