import api from "@/lib/api";

export const getBooks = async () => {
  const { data } = await api.get("/api/library/books");
  return data;
};

export const createBook = async (payload: any) => {
  const { data } = await api.post("/api/library/books", payload);
  return data;
};

export const getLoans = async () => {
  const { data } = await api.get("/api/library/loans");
  return data;
};

export const issueBook = async (payload: {
  bookId: string;
  studentId: string;
}) => {
  const { data } = await api.post("/api/library/loans/issue", payload);
  return data;
};

export const returnBook = async (loanId: string) => {
  const { data } = await api.post("/api/library/loans/return", { loanId });
  return data;
};
