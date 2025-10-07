import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/book`;

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  price: number;
}

// Fetch all books
export const getBooks = async (): Promise<Book[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Add a new book
export const addBook = async (book: Omit<Book, "id">): Promise<Book> => {
  const response = await axios.post(API_URL, book);
  return response.data;
};

// Update a book
export const updateBook = async (book: Book): Promise<Book> => {
  const response = await axios.put(`${API_URL}/${book.id}`, book);
  return response.data;
};

// Delete a book
export const deleteBook = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
