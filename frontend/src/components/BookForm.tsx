import React, { useEffect, useState } from "react";
import { Book, addBook, updateBook } from "../services/BookService";
import { Button, TextField, Box } from "@mui/material";

interface Props {
  book?: Book | null;
  onClose: () => void;
}

const BookForm: React.FC<Props> = ({ book, onClose }) => {
  const [formData, setFormData] = useState<Omit<Book, "id">>({
    title: "",
    author: "",
    isbn: "",
    price: 0,
  });

  useEffect(() => {
    if (book) {
      setFormData({ title: book.title, author: book.author, isbn: book.isbn, price: book.price });
    }
  }, [book]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (book) {
      await updateBook({ ...formData, id: book.id });
    } else {
      await addBook(formData);
    }
    onClose();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <TextField
        label="Author"
        name="author"
        value={formData.author}
        onChange={handleChange}
        required
      />
      <TextField
        label="ISBN"
        name="isbn"
        value={formData.isbn}
        onChange={handleChange}
        required
      />
      <TextField
        label="Price"
        name="price"
        type="number"
        value={formData.price}
        onChange={handleChange}
        required
      />
      <Button type="submit" variant="contained" color="primary">
        {book ? "Update" : "Add"} Book
      </Button>
    </Box>
  );
};

export default BookForm;
