import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import {
  BookOpen,
  Plus,
  X,
  FileText,
  AlertCircle,
  Check,
  Loader2,
  Search,
  BookmarkCheck,
  RefreshCw,
  Coins,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string | null;
  quantity: number;
  available: number;
}

interface StudentItem {
  id: string;
  rollNumber: string | null;
  user: {
    name: string;
    email: string;
  };
}

interface BookLoan {
  id: string;
  bookId: string;
  studentId: string;
  loanDate: string;
  returnDate: string | null;
  status: string;
  fineAmount: number;
  book: Book;
  student: {
    id: string;
    rollNumber: string | null;
    user: {
      name: string;
      email: string;
    };
  };
}

export default function LibraryPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'catalog' | 'loans'>('catalog');
  const [searchTerm, setSearchTerm] = useState('');

  // Catalog Book Modal Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [catError, setCatError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Issue Book Modal Form States
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [issueError, setIssueError] = useState('');

  const userRole = user?.role || 'member';
  const canManage = ['owner', 'admin', 'principal', 'hod', 'faculty'].includes(
    userRole,
  );

  // Load books
  const { data: booksRes, isLoading: isBooksLoading } = useQuery<{
    books: Book[];
  }>({
    queryKey: ['books'],
    queryFn: () => api.get('/api/library/books').then(res => res.data),
  });

  // Load active loans
  const { data: loansRes, isLoading: isLoansLoading } = useQuery<{
    loans: BookLoan[];
  }>({
    queryKey: ['loans'],
    queryFn: () => api.get('/api/library/loans').then(res => res.data),
  });

  // Load students for dropdown selection
  const { data: studentsRes } = useQuery<any>({
    queryKey: ['studentsForLibrary'],
    queryFn: () => api.get('/api/students?limit=100').then(res => res.data),
    enabled: isIssueModalOpen,
  });

  const createBookMutation = useMutation({
    mutationFn: (payload: any) =>
      api
        .post('/api/library/books', JSON.stringify(payload))
        .then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      setIsModalOpen(false);
      setTitle('');
      setAuthor('');
      setIsbn('');
      setQuantity('1');
      setCatError('');
      setSuccessMessage('Book catalogued successfully.');
      setTimeout(() => setSuccessMessage(''), 5000);
    },
    onError: (err: any) => {
      setCatError(err.message || 'Failed to catalog book.');
    },
  });

  const issueBookMutation = useMutation({
    mutationFn: (payload: { bookId: string; studentId: string }) =>
      api
        .post('/api/library/loans/issue', JSON.stringify(payload))
        .then(res => res.data),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      setIsIssueModalOpen(false);
      setSelectedStudentId('');
      setSelectedBook(null);
      setIssueError('');
      setSuccessMessage(data.message || 'Book issued to student.');
      setTimeout(() => setSuccessMessage(''), 5000);
    },
    onError: (err: any) => {
      setIssueError(err.message || 'Failed to issue book.');
    },
  });

  const returnBookMutation = useMutation({
    mutationFn: (loanId: string) =>
      api
        .post('/api/library/loans/return', JSON.stringify({ loanId }))
        .then(res => res.data),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      setSuccessMessage(data.message || 'Book returned successfully.');
      setTimeout(() => setSuccessMessage(''), 5000);
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to return book.');
    },
  });

  const handleCatalogueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim() || !quantity) {
      setCatError('Title, Author, and Quantity are required.');
      return;
    }
    createBookMutation.mutate({
      title,
      author,
      isbn: isbn || undefined,
      quantity: parseInt(quantity, 10),
    });
  };

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook || !selectedStudentId) {
      setIssueError('Please select a student.');
      return;
    }
    issueBookMutation.mutate({
      bookId: selectedBook.id,
      studentId: selectedStudentId,
    });
  };

  const handleReturnBook = (loanId: string) => {
    if (
      confirm('Are you sure you want to log return check-in for this book?')
    ) {
      returnBookMutation.mutate(loanId);
    }
  };

  const books = booksRes?.books || [];
  const loans = loansRes?.loans || [];
  const students = studentsRes?.data || [];

  const filteredBooks = books.filter(
    b =>
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.isbn && b.isbn.includes(searchTerm)),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-left">
          <h1 className="text-3xl font-bold tracking-tight">Library Console</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Catalogue school textbook volumes, track student borrow status
            registers, and audit fine logs.
          </p>
        </div>
        {canManage && (
          <Button
            onClick={() => setIsModalOpen(true)}
            className="cursor-pointer"
          >
            <Plus className="size-4 mr-2" />
            Catalogue Book
          </Button>
        )}
      </div>

      {successMessage && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-600 dark:text-emerald-500 border border-emerald-500/20 text-left animate-fade-in">
          <Check className="size-4 shrink-0 text-emerald-500" />
          <span className="text-sm font-semibold">{successMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-border gap-4">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'catalog'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Book Inventory ({books.length})
        </button>
        <button
          onClick={() => setActiveTab('loans')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'loans'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Active Loans & History ({loans.length})
        </button>
      </div>

      {/* Inventory Catalog Tab */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 max-w-sm border border-input rounded-md px-3 bg-background">
            <Search className="size-4 text-muted-foreground shrink-0" />
            <Input
              placeholder="Search books by title, author, or ISBN..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-10"
            />
          </div>

          {isBooksLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : filteredBooks.length === 0 ? (
            <Card className="border-dashed border-2 py-16 flex flex-col items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                <BookOpen className="size-6" />
              </div>
              <h3 className="font-semibold text-lg text-foreground">
                No Books Catalogued
              </h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm text-center">
                Get started by cataloguing resource volumes or search terms.
              </p>
            </Card>
          ) : (
            <Card className="border-border bg-card">
              <CardContent className="p-0 text-left">
                <div className="relative w-full overflow-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-border font-medium text-muted-foreground bg-muted/30">
                        <th className="p-4">Title</th>
                        <th className="p-4">Author</th>
                        <th className="p-4">ISBN</th>
                        <th className="p-4 text-center">Total Copies</th>
                        <th className="p-4 text-center">Available</th>
                        {canManage && (
                          <th className="p-4 text-right">Actions</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBooks.map(book => {
                        const isAvailable = book.available > 0;
                        const qtyColor = isAvailable
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border border-emerald-500/20'
                          : 'bg-destructive/10 text-destructive border border-destructive/20 font-semibold';

                        return (
                          <tr
                            key={book.id}
                            className="border-b border-border/50 hover:bg-muted/10 transition-colors"
                          >
                            <td className="p-4 font-bold text-foreground">
                              {book.title}
                            </td>
                            <td className="p-4 text-muted-foreground">
                              {book.author}
                            </td>
                            <td className="p-4 font-mono text-xs">
                              {book.isbn || 'N/A'}
                            </td>
                            <td className="p-4 text-center text-foreground font-semibold">
                              {book.quantity}
                            </td>
                            <td className="p-4 text-center">
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${qtyColor}`}
                              >
                                {book.available} Available
                              </span>
                            </td>
                            {canManage && (
                              <td className="p-4 text-right">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={!isAvailable}
                                  onClick={() => {
                                    setSelectedBook(book);
                                    setIsIssueModalOpen(true);
                                  }}
                                  className="cursor-pointer text-xs"
                                >
                                  <BookmarkCheck className="size-3.5 mr-1 text-primary" />
                                  Issue Book
                                </Button>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Loans Checkouts Tab */}
      {activeTab === 'loans' && (
        <div className="space-y-4">
          {isLoansLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : loans.length === 0 ? (
            <Card className="border-dashed border-2 py-16 flex flex-col items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                <FileText className="size-6" />
              </div>
              <h3 className="font-semibold text-lg text-foreground">
                No Borrow Logs Found
              </h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm text-center">
                There are no active or historic student textbook loans recorded.
              </p>
            </Card>
          ) : (
            <Card className="border-border bg-card">
              <CardContent className="p-0 text-left">
                <div className="relative w-full overflow-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-border font-medium text-muted-foreground bg-muted/30">
                        <th className="p-4">Book Title</th>
                        <th className="p-4">Borrower Student</th>
                        <th className="p-4">Issue Date</th>
                        <th className="p-4">Due Date</th>
                        <th className="p-4">Return Date</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-right">Overdue Fine</th>
                        {canManage && (
                          <th className="p-4 text-right">Actions</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {loans.map(loan => {
                        const issueDate = new Date(loan.loanDate);
                        // Due date: 14 days after issue date
                        const dueDate = new Date(
                          issueDate.getTime() + 14 * 24 * 60 * 60 * 1000,
                        );
                        const isReturned = loan.status === 'returned';

                        // Calculate live fine preview if not returned yet
                        let liveFine = loan.fineAmount;
                        if (!isReturned) {
                          const now = new Date();
                          const diffTime = now.getTime() - issueDate.getTime();
                          const diffDays = Math.floor(
                            diffTime / (24 * 60 * 60 * 1000),
                          );
                          if (diffDays > 14) {
                            liveFine = diffDays - 14;
                          }
                        }

                        const statusColor = isReturned
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border border-emerald-500/20'
                          : liveFine > 0
                            ? 'bg-destructive/10 text-destructive border border-destructive/20 font-bold animate-pulse'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-500/20';

                        return (
                          <tr
                            key={loan.id}
                            className="border-b border-border/50 hover:bg-muted/10 transition-colors"
                          >
                            <td className="p-4 font-bold text-foreground">
                              {loan.book.title}
                            </td>
                            <td className="p-4">
                              <div className="font-semibold text-foreground">
                                {loan.student.user.name}
                              </div>
                              <div className="text-[10px] text-muted-foreground">
                                Roll: {loan.student.rollNumber || 'N/A'}
                              </div>
                            </td>
                            <td className="p-4">
                              {issueDate.toLocaleDateString()}
                            </td>
                            <td className="p-4 font-medium text-foreground">
                              {dueDate.toLocaleDateString()}
                            </td>
                            <td className="p-4 text-muted-foreground">
                              {loan.returnDate
                                ? new Date(loan.returnDate).toLocaleDateString()
                                : '-'}
                            </td>
                            <td className="p-4 text-center">
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-0.2 text-[10px] font-semibold capitalize ${statusColor}`}
                              >
                                {isReturned
                                  ? 'Returned'
                                  : liveFine > 0
                                    ? 'Overdue'
                                    : 'Issued'}
                              </span>
                            </td>
                            <td className="p-4 text-right font-semibold text-foreground">
                              {liveFine > 0 ? (
                                <span className="text-destructive flex items-center justify-end gap-1">
                                  <Coins className="size-3" />$
                                  {liveFine.toFixed(2)}
                                </span>
                              ) : (
                                '$0.00'
                              )}
                            </td>
                            {canManage && (
                              <td className="p-4 text-right">
                                {!isReturned && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleReturnBook(loan.id)}
                                    className="cursor-pointer border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/10 text-xs"
                                  >
                                    <RefreshCw className="size-3.5 mr-1" />
                                    Return Check-in
                                  </Button>
                                )}
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Catalogue Book Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <Card className="w-full max-w-md bg-card border-border my-8 animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="relative text-left pb-4 border-b border-border">
              <CardTitle className="text-xl">Catalogue Book Volume</CardTitle>
              <CardDescription>
                Add new textbook registry inventory details to school database.
              </CardDescription>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:bg-muted cursor-pointer"
              >
                <X className="size-4" />
              </Button>
            </CardHeader>

            <form onSubmit={handleCatalogueSubmit}>
              <CardContent className="space-y-4 pt-6 text-left">
                {catError && (
                  <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20 animate-fade-in">
                    <AlertCircle className="size-4 shrink-0 text-destructive" />
                    <span className="text-xs font-semibold">{catError}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <label
                    htmlFor="bookTitle"
                    className="text-sm font-semibold text-foreground"
                  >
                    Book Title *
                  </label>
                  <Input
                    id="bookTitle"
                    placeholder="e.g. Introduction to Algorithms, Physics Part 1"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="bookAuthor"
                    className="text-sm font-semibold text-foreground"
                  >
                    Author Name *
                  </label>
                  <Input
                    id="bookAuthor"
                    placeholder="e.g. Thomas H. Cormen, Stephen Hawking"
                    value={author}
                    onChange={e => setAuthor(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="bookIsbn"
                      className="text-sm font-semibold text-foreground"
                    >
                      ISBN Code
                    </label>
                    <Input
                      id="bookIsbn"
                      placeholder="e.g. 9780262033848"
                      value={isbn}
                      onChange={e => setIsbn(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="bookQuantity"
                      className="text-sm font-semibold text-foreground"
                    >
                      Total Copies *
                    </label>
                    <Input
                      id="bookQuantity"
                      type="number"
                      min="1"
                      placeholder="1"
                      value={quantity}
                      onChange={e => setQuantity(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>

              <div className="flex justify-end gap-3 p-6 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createBookMutation.isPending}>
                  {createBookMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Add Book'
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Issue Book Modal */}
      {isIssueModalOpen && selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <Card className="w-full max-w-md bg-card border-border my-8 animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="relative text-left pb-4 border-b border-border">
              <CardTitle className="text-xl text-primary">
                Issue Book Volume
              </CardTitle>
              <CardDescription>
                Assign copy of <strong>{selectedBook.title}</strong> by{' '}
                {selectedBook.author} to a student borrower.
              </CardDescription>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsIssueModalOpen(false);
                  setSelectedStudentId('');
                  setSelectedBook(null);
                }}
                className="absolute top-4 right-4 text-muted-foreground hover:bg-muted cursor-pointer"
              >
                <X className="size-4" />
              </Button>
            </CardHeader>

            <form onSubmit={handleIssueSubmit}>
              <CardContent className="space-y-4 pt-6 text-left">
                {issueError && (
                  <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20 animate-fade-in">
                    <AlertCircle className="size-4 shrink-0 text-destructive" />
                    <span className="text-xs font-semibold">{issueError}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <label
                    htmlFor="issueStudentSelect"
                    className="text-sm font-semibold text-foreground"
                  >
                    Select Student Borrower *
                  </label>
                  <select
                    id="issueStudentSelect"
                    value={selectedStudentId}
                    onChange={e => setSelectedStudentId(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Choose Student Borrower...</option>
                    {students.map((s: StudentItem) => (
                      <option key={s.id} value={s.id}>
                        {s.user.name} (Roll: #{s.rollNumber || 'N/A'}) -{' '}
                        {s.user.email}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="text-xs text-muted-foreground border-l-2 border-primary pl-3 py-1 bg-muted/40 rounded-r">
                  <p className="font-semibold text-foreground mb-0.5">
                    Loan Rule Conditions:
                  </p>
                  Book borrow loan duration is configured for a standard limit
                  of 14 days, after which an overdue fine charge rate of $1.00
                  per day accumulates automatically.
                </div>
              </CardContent>

              <div className="flex justify-end gap-3 p-6 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsIssueModalOpen(false);
                    setSelectedStudentId('');
                    setSelectedBook(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={issueBookMutation.isPending}>
                  {issueBookMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Issuing...
                    </>
                  ) : (
                    'Confirm Issue'
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
