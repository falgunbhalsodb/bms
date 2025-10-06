package com.bms.app.service;

import com.bms.app.dto.BookRequest;
import com.bms.app.dto.BookResponse;
import com.bms.app.entity.Book;
import com.bms.app.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;


    public Book createBook(Book book) {
        return bookRepository.save(book);
    }


    public Optional<Book> getBookById(Long id) {
        return bookRepository.findById(id);
    }


    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }


    public Optional<Book> updateBook(Long id, Book bookParam) {
        Optional<Book> existingBook = bookRepository.findById(id);
        if (existingBook.isPresent()) {
            Book book = existingBook.get();

            if (bookParam.getTitle() != null) {
                book.setTitle(bookParam.getTitle());
            }
            if (bookParam.getAuthor() != null) {
                book.setAuthor(bookParam.getAuthor());
            }
            if (bookParam.getIsbn() != null) {
                book.setIsbn(bookParam.getIsbn());
            }
            if (bookParam.getPrice() > 0) {
                book.setPrice(bookParam.getPrice());
            }
            bookRepository.save(book);

            return Optional.of(bookRepository.save(book));
        }
        return Optional.empty();
    }


    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }
}
