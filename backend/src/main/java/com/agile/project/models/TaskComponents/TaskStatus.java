package com.agile.project.models.TaskComponents;

public enum TaskStatus {
    COMPLETE("COMPLETE"),
    INPROGRESS("INPROGRESS"),
    NOTSTARTED("NOTSTARTED");

    private final String status;

    TaskStatus(String status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return status;
    }
}
