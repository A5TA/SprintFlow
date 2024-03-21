package com.agile.project.models.TaskComponents;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskRequest {
    String name;
    String desc;
    Date startDate;
    Date dueDate;
    int points;
    String projectName;
}
