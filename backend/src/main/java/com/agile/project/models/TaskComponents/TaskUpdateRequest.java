package com.agile.project.models.TaskComponents;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

//This request format would be for modifing task information like points, date, desc, name, but also assignment to new user
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskUpdateRequest {
    String name;
    String desc;
    Date dueDate;
    int points;
    String taskStatus;
    String assignEmail;
    Integer taskId;

}
