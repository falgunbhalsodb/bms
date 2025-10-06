import React, { useEffect, useState } from "react";
import { Book, getBooks, deleteBook } from "../services/BookService";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import BookForm from "../components/BookForm";

const BooksPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [open, setOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const data = await getBooks();
    setBooks(data);
  };

  const handleDelete = async (id: number) => {
    await deleteBook(id);
    fetchBooks();
  };

  const handleOpen = (book?: Book) => {
    setEditingBook(book || null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingBook(null);
    fetchBooks();
  };

  return (
    <div>
      <h2>Book List</h2>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Add Book
      </Button>

      <List>
        {books.map((book) => (
          <ListItem key={book.id}>
            <ListItemText
              primary={`${book.title} by ${book.author}`}
              secondary={`Price: ${book.price}`}
            />
            <Button color="primary" onClick={() => handleOpen(book)}>
              Edit
            </Button>
            <Button color="secondary" onClick={() => handleDelete(book.id)}>
              Delete
            </Button>
          </ListItem>
        ))}
      </List>

      {/* MUI Dialog for Add/Edit */}
      <Dialog open={open} onClose={handleClose} fullWidth={true}>
        <DialogTitle>{editingBook ? "Edit Book" : "Add Book"}</DialogTitle>
        <DialogContent>
          <BookForm book={editingBook} onClose={handleClose} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BooksPage;
