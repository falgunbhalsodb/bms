package com.bms.app.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/")
    public String home() {
        return "Book Management System is running!";
    }

    @GetMapping("/test")
    public String test() {
        return "Test endpoint working";
    }
}