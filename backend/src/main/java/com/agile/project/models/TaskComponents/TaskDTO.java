package com.agile.project.models.TaskComponents;

import lombok.*;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskDTO {
    private Integer id;
    private String name;
    private String description;
    private Date startDate;
    private Date dueDate;
    private int points;
    private TaskStatus taskStatus;
    private Integer userId; // We cant have the object so we have id
    private Integer projectId;
    private String assignedTO;
}
