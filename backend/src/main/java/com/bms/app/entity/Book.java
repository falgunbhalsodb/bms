package com.bms.app.entity;

// JPA temporarily disabled
/*
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
*/
import lombok.*;


// @Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Book {

    // @Id
    // @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String author;
    private String isbn;
    private double price;
}
