package com.bms.app.controller;

// Database health controller temporarily disabled
/*
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;

@RestController
public class DatabaseHealthController {

    @Autowired(required = false)
    private DataSource dataSource;

    @GetMapping("/db-health")
    public String checkDatabaseConnection() {
        if (dataSource == null) {
            return "Database not configured";
        }
        
        try (Connection connection = dataSource.getConnection()) {
            return "Database connection: OK";
        } catch (Exception e) {
            return "Database connection failed: " + e.getMessage();
        }
    }
}
*/