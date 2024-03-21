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
public class ProjectDTO {
    private Integer id;
    private String name;
    private Date startDate;
    private Date endDate;
    private Integer teamId;
}
