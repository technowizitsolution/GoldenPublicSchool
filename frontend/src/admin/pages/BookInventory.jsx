import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Loader, AlertCircle, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/authContext/AuthContext';

const BookInventory = () => {
    const { token, axios } = useAuth();

    // State management
    const [booksByClass, setBooksByClass] = useState({});
    const [selectedClass, setSelectedClass] = useState('1');
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedItems, setExpandedItems] = useState(new Set());

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        subject: '',
        className: '1',
        totalStock: 0,
        issuedCount: 0,
        damagedCount: 0,
        description: '',
        isbn: '',
        publisher: '',
        author: '',
        edition: '',
        price: 0
    });

    const subjects = ['Math', 'Science', 'English', 'Social Studies', 'Physics', 'Chemistry', 'Biology'];
    const classes = ['Nursery', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

    // ============ API CALLS ============

    const getAllBooks = async () => {
        try {
            setLoading(true);

            // Fetch all books from all classes
            const response = await axios.get('/admin/books/all', {
                headers: { token }
            });

            // Group books by className
            const grouped = {};
            const booksData = response.data.data || [];

            booksData.forEach(book => {
                const className = book.className;
                if (!grouped[className]) {
                    grouped[className] = [];
                }
                grouped[className].push(book);
            });

            setBooksByClass(grouped);

            // Auto-select first class with books if current selection has none
            if (Object.keys(grouped).length > 0 && !grouped[selectedClass]) {
                const firstClassWithBooks = Object.keys(grouped)[0];
                setSelectedClass(firstClassWithBooks);
            }
        } catch (error) {
            console.error('Error fetching books:', error);
            if (error.response?.status === 404 || error.response?.status === 500) {
                setBooksByClass({});
            } else {
                alert('Failed to load books');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAddBook = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.subject || !formData.className) {
            alert('Please fill in all required fields (Name, Subject, Class)');
            return;
        }

        if (formData.totalStock < 0) {
            alert('Total stock cannot be negative');
            return;
        }

        try {
            setLoading(true);

            const payload = {
                name: formData.name.trim(),
                subject: formData.subject,
                className: formData.className,
                totalStock: Number(formData.totalStock) || 0,
                issuedCount: Number(formData.issuedCount) || 0,
                damagedCount: Number(formData.damagedCount) || 0,
                description: formData.description.trim(),
                isbn: formData.isbn.trim(),
                publisher: formData.publisher.trim(),
                author: formData.author.trim(),
                edition: formData.edition.trim(),
                price: Number(formData.price) || 0
            };

            if (editingId) {
                // Update existing book
                await axios.put(
                    `/admin/books/update/${editingId}`,
                    payload,
                    {
                        headers: { token }
                    }
                );
                alert('Book updated successfully');
            } else {
                // Create new book
                await axios.post(
                    '/admin/books/add',
                    payload,
                    {
                        headers: { token }
                    }
                );
                alert('Book created successfully');
            }

            // Reset form and refresh data
            resetForm();
            getAllBooks();
        } catch (error) {
            console.error('Error saving book:', error);
            alert(error.response?.data?.message || 'Failed to save book');
        } finally {
            setLoading(false);
        }
    };

    const handleEditBook = (book) => {
        setFormData({
            name: book.name,
            subject: book.subject,
            className: book.className,
            totalStock: book.totalStock,
            issuedCount: book.issuedCount || 0,
            damagedCount: book.damagedCount || 0,
            description: book.description || '',
            isbn: book.isbn || '',
            publisher: book.publisher || '',
            author: book.author || '',
            edition: book.edition || '',
            price: book.price || 0
        });
        setEditingId(book._id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteBook = async (id) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                setLoading(true);
                await axios.delete(`/admin/books/delete/${id}`, {
                    headers: { token }
                });
                alert('Book deleted successfully');
                getAllBooks();
            } catch (error) {
                console.error('Error deleting book:', error);
                alert(error.response?.data?.message || 'Failed to delete book');
            } finally {
                setLoading(false);
            }
        }
    };

    // ============ LIFECYCLE ============

    useEffect(() => {
        getAllBooks();
    }, [token]);

    // ============ HELPER FUNCTIONS ============

    const toggleExpanded = (id) => {
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedItems(newExpanded);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            subject: '',
            className: selectedClass,
            totalStock: 0,
            issuedCount: 0,
            damagedCount: 0,
            description: '',
            isbn: '',
            publisher: '',
            author: '',
            edition: '',
            price: 0
        });
        setShowForm(false);
        setEditingId(null);
    };

    // Get books for selected class
    const currentClassBooks = booksByClass[selectedClass] || [];

    // Filter books based on search
    const filteredBooks = currentClassBooks.filter(book => {
        const search = searchTerm.toLowerCase();
        return (
            (book.name?.toLowerCase() || '').includes(search) ||
            (book.subject?.toLowerCase() || '').includes(search) ||
            (book.author?.toLowerCase() || '').includes(search)
        );
    });

    console.log("Filtered Books : ", filteredBooks);

    // Calculate overall statistics
    const allBooks = Object.values(booksByClass).flat();
    const totalBooks = allBooks.length;
    const totalStock = allBooks.reduce((sum, book) => sum + (book.totalStock || 0), 0);
    const totalIssued = allBooks.reduce((sum, book) => sum + (book.issuedCount || 0), 0);
    const totalDamaged = allBooks.reduce((sum, book) => sum + (book.damagedCount || 0), 0);

    // ============ RENDER ============

    if (loading && Object.keys(booksByClass).length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6 sm:mb-8 lg:mb-10">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <BookOpen className="w-6 sm:w-8 h-6 sm:h-8 text-blue-600 flex-shrink-0" />
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                        Book Inventory Management
                    </h1>
                </div>
                <p className="text-sm sm:text-base text-gray-600 mt-2">Add and manage school books and stock by class</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8 lg:mb-10">
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
                    <p className="text-gray-600 text-xs sm:text-sm font-medium mb-2">Total Books</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{totalBooks}</p>
                    <p className="text-gray-500 text-xs mt-2">Across all classes</p>
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border-l-4 border-green-500">
                    <p className="text-gray-600 text-xs sm:text-sm font-medium mb-2">Total Stock</p>
                    <p className="text-2xl sm:text-3xl font-bold text-green-600">{totalStock}</p>
                    <p className="text-gray-500 text-xs mt-2">Books in inventory</p>
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
                    <p className="text-gray-600 text-xs sm:text-sm font-medium mb-2">Issued</p>
                    <p className="text-2xl sm:text-3xl font-bold text-yellow-600">{totalIssued}</p>
                    <p className="text-gray-500 text-xs mt-2">Books distributed</p>
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border-l-4 border-red-500">
                    <p className="text-gray-600 text-xs sm:text-sm font-medium mb-2">Damaged</p>
                    <p className="text-2xl sm:text-3xl font-bold text-red-600">{totalDamaged}</p>
                    <p className="text-gray-500 text-xs mt-2">Books damaged</p>
                </div>
            </div>

            {/* Class Tabs */}
            {/* Class Tabs */}
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-0">
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Select Class:</span>
                    <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                        {classes.map(cls => {
                            const classBooks = booksByClass[cls] || [];
                            const hasBooks = classBooks.length > 0;

                            return (
                                <button
                                    key={cls}
                                    onClick={() => setSelectedClass(cls)}
                                    className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition whitespace-nowrap text-sm ${selectedClass === cls
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : hasBooks
                                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    {cls}
                                    {hasBooks && (
                                        <span className="ml-1 text-xs opacity-75">
                                            ({classBooks.length})
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Class Summary for Selected Class */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-blue-100">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">
                    Class {selectedClass} - Book Summary
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="bg-white bg-opacity-50 p-3 sm:p-4 rounded-lg">
                        <p className="text-gray-600 text-xs sm:text-sm">Books</p>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{currentClassBooks.length}</p>
                    </div>
                    <div className="bg-white bg-opacity-50 p-3 sm:p-4 rounded-lg">
                        <p className="text-gray-600 text-xs sm:text-sm">Total Stock</p>
                        <p className="text-xl sm:text-2xl font-bold text-green-600 mt-1">
                            {currentClassBooks.reduce((sum, book) => sum + (book.totalStock || 0), 0)}
                        </p>
                    </div>
                    <div className="bg-white bg-opacity-50 p-3 sm:p-4 rounded-lg">
                        <p className="text-gray-600 text-xs sm:text-sm">Issued</p>
                        <p className="text-xl sm:text-2xl font-bold text-yellow-600 mt-1">
                            {currentClassBooks.reduce((sum, book) => sum + (book.issuedCount || 0), 0)}
                        </p>
                    </div>
                    <div className="bg-white bg-opacity-50 p-3 sm:p-4 rounded-lg">
                        <p className="text-gray-600 text-xs sm:text-sm">Available</p>
                        <p className="text-xl sm:text-2xl font-bold text-blue-600 mt-1">
                            {currentClassBooks.reduce((sum, book) => {
                                const available = book.totalStock - (book.issuedCount || 0) - (book.damagedCount || 0);
                                return sum + available;
                            }, 0)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Add Form Button */}
            {!showForm && (
                <div className="mb-6 sm:mb-8">
                    <button
                        onClick={() => {
                            setFormData({ ...formData, className: selectedClass });
                            setShowForm(true);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="flex items-center gap-2 px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm sm:text-base"
                    >
                        <Plus className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" />
                        <span>Add Book to Class {selectedClass}</span>
                    </button>
                </div>
            )}

            {/* Add/Edit Form */}
            {showForm && (
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-8 border border-gray-200">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                        {editingId ? 'Edit Book' : `Add New Book to Class ${selectedClass}`}
                    </h2>

                    <form onSubmit={handleAddBook} className="space-y-6">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            {/* Book Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Book Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter book name"
                                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    required
                                />
                            </div>

                            {/* Subject */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subject *
                                </label>
                                <select
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    required
                                >
                                    <option value="">Select Subject</option>
                                    {subjects.map(subject => (
                                        <option key={subject} value={subject}>
                                            {subject}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Class - Read Only when adding, shows current class */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Class *
                                </label>
                                <input
                                    type="text"
                                    value={formData.className}
                                    readOnly
                                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-sm"
                                />
                            </div>

                            {/* Author */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Author
                                </label>
                                <input
                                    type="text"
                                    value={formData.author}
                                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                    placeholder="Enter author name"
                                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                            </div>

                            {/* Publisher */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Publisher
                                </label>
                                <input
                                    type="text"
                                    value={formData.publisher}
                                    onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                                    placeholder="Enter publisher name"
                                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                            </div>

                            {/* ISBN */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    ISBN
                                </label>
                                <input
                                    type="text"
                                    value={formData.isbn}
                                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                                    placeholder="Enter ISBN number"
                                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                            </div>

                            {/* Edition */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Edition
                                </label>
                                <input
                                    type="text"
                                    value={formData.edition}
                                    onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                                    placeholder="e.g., 1st Edition"
                                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price (₹)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                    placeholder="0.00"
                                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                            </div>
                        </div>

                        {/* Stock Information */}
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Stock Information</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                                {/* Total Stock */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Total Stock *
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.totalStock}
                                        onChange={(e) => setFormData({ ...formData, totalStock: parseInt(e.target.value) || 0 })}
                                        placeholder="0"
                                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        required
                                    />
                                </div>

                                {/* Issued Count */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Issued Count
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.issuedCount}
                                        onChange={(e) => setFormData({ ...formData, issuedCount: parseInt(e.target.value) || 0 })}
                                        placeholder="0"
                                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    />
                                </div>

                                {/* Damaged Count */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Damaged Count
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.damagedCount}
                                        onChange={(e) => setFormData({ ...formData, damagedCount: parseInt(e.target.value) || 0 })}
                                        placeholder="0"
                                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Enter book description"
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                                rows="3"
                            />
                        </div>

                        {/* Form Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 sm:px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 text-sm"
                            >
                                {loading ? 'Saving...' : editingId ? 'Update Book' : 'Add Book'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Search Bar */}
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm mb-6">
                <div className="flex items-center gap-2">
                    <Search className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400 flex-shrink-0" />
                    <input
                        type="text"
                        placeholder="Search books by name, subject, or author..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 outline-none text-gray-700 text-sm bg-transparent"
                    />
                </div>
            </div>

            {/* Books List */}
            <div className="space-y-4 sm:space-y-6">
                {filteredBooks.length > 0 ? (
                    filteredBooks.map(book => {
                        const available = book.availableStock || (book.totalStock - (book.issuedCount || 0) - (book.damagedCount || 0));
                        const isExpanded = expandedItems.has(book._id);
                        const stockPercentage = book.totalStock > 0 ? (available / book.totalStock) * 100 : 0;

                        return (
                            <div key={book._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                {/* Book Header */}
                                <div className="p-4 sm:p-6">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 break-words">{book.name}</h3>
                                                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full whitespace-nowrap">
                                                    {book.subject}
                                                </span>
                                            </div>
                                            {book.author && (
                                                <p className="text-gray-600 text-xs sm:text-sm">
                                                    <span className="font-medium">Author:</span> {book.author}
                                                </p>
                                            )}
                                            {book.description && (
                                                <p className="text-gray-600 text-xs sm:text-sm mt-1 line-clamp-2">{book.description}</p>
                                            )}
                                        </div>

                                        <div className="flex gap-2 sm:gap-3 items-center flex-shrink-0">
                                            <button
                                                onClick={() => toggleExpanded(book._id)}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition"
                                                title={isExpanded ? 'Collapse' : 'Expand'}
                                            >
                                                {isExpanded ? (
                                                    <ChevronUp className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600" />
                                                ) : (
                                                    <ChevronDown className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600" />
                                                )}
                                            </button>

                                            <button
                                                onClick={() => handleEditBook(book)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                title="Edit"
                                            >
                                                <Edit2 className="w-4 sm:w-5 h-4 sm:h-5" />
                                            </button>

                                            <button
                                                onClick={() => handleDeleteBook(book._id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 sm:w-5 h-4 sm:h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Summary Grid */}
                                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-4">
                                        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                            <p className="text-gray-600 text-xs font-medium">Total Stock</p>
                                            <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{book.totalStock}</p>
                                        </div>
                                        <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                                            <p className="text-gray-600 text-xs font-medium">Issued</p>
                                            <p className="text-xl sm:text-2xl font-bold text-blue-600 mt-1">{book.issuedCount || 0}</p>
                                        </div>
                                        <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                                            <p className="text-gray-600 text-xs font-medium">Available</p>
                                            <p className="text-xl sm:text-2xl font-bold text-green-600 mt-1">{available}</p>
                                        </div>
                                        <div className="bg-red-50 p-3 sm:p-4 rounded-lg">
                                            <p className="text-gray-600 text-xs font-medium">Damaged</p>
                                            <p className="text-xl sm:text-2xl font-bold text-red-600 mt-1">{book.damagedCount || 0}</p>
                                        </div>
                                    </div>

                                    {/* Stock Progress Bar */}
                                    <div className="mt-4">
                                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                                            <span>Stock Status</span>
                                            <span>{stockPercentage.toFixed(0)}% Available</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all ${stockPercentage > 50
                                                    ? 'bg-green-500'
                                                    : stockPercentage > 20
                                                        ? 'bg-yellow-500'
                                                        : 'bg-red-500'
                                                    }`}
                                                style={{ width: `${stockPercentage}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Low Stock Alert */}
                                    {available < 10 && available > 0 && (
                                        <div className="mt-4 p-3 sm:p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-start sm:items-center gap-2">
                                            <AlertCircle className="w-4 sm:w-5 h-4 sm:h-5 text-orange-600 flex-shrink-0 mt-0.5 sm:mt-0" />
                                            <p className="text-orange-800 text-xs sm:text-sm font-medium">
                                                Low stock alert: Only {available} books available
                                            </p>
                                        </div>
                                    )}

                                    {available === 0 && (
                                        <div className="mt-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start sm:items-center gap-2">
                                            <AlertCircle className="w-4 sm:w-5 h-4 sm:h-5 text-red-600 flex-shrink-0 mt-0.5 sm:mt-0" />
                                            <p className="text-red-800 text-xs sm:text-sm font-medium">
                                                Out of stock - Please reorder
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Expandable Book Details */}
                                {isExpanded && (
                                    <div className="border-t border-gray-200 bg-gray-50 p-4 sm:p-6">
                                        <h4 className="font-bold text-gray-900 mb-4 text-sm sm:text-base">Book Details</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                            {book.isbn && (
                                                <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
                                                    <p className="text-gray-600 text-xs font-medium">ISBN</p>
                                                    <p className="text-xs sm:text-sm font-semibold text-gray-900 mt-1 break-words">{book.isbn}</p>
                                                </div>
                                            )}
                                            {book.publisher && (
                                                <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
                                                    <p className="text-gray-600 text-xs font-medium">Publisher</p>
                                                    <p className="text-xs sm:text-sm font-semibold text-gray-900 mt-1 break-words">{book.publisher}</p>
                                                </div>
                                            )}
                                            {book.edition && (
                                                <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
                                                    <p className="text-gray-600 text-xs font-medium">Edition</p>
                                                    <p className="text-xs sm:text-sm font-semibold text-gray-900 mt-1">{book.edition}</p>
                                                </div>
                                            )}
                                            {book.price > 0 && (
                                                <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
                                                    <p className="text-gray-600 text-xs font-medium">Price</p>
                                                    <p className="text-xs sm:text-sm font-semibold text-gray-900 mt-1">₹{book.price.toFixed(2)}</p>
                                                </div>
                                            )}
                                            {book.createdAt && (
                                                <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
                                                    <p className="text-gray-600 text-xs font-medium">Added On</p>
                                                    <p className="text-xs sm:text-sm font-semibold text-gray-900 mt-1">
                                                        {new Date(book.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            )}
                                            {book.updatedAt && (
                                                <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
                                                    <p className="text-gray-600 text-xs font-medium">Last Updated</p>
                                                    <p className="text-xs sm:text-sm font-semibold text-gray-900 mt-1">
                                                        {new Date(book.updatedAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12 text-center">
                        <BookOpen className="w-12 sm:w-16 h-12 sm:h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-base sm:text-lg">
                            {currentClassBooks.length === 0
                                ? `No books added for Class ${selectedClass} yet. Add your first book to get started!`
                                : 'No matching books found'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookInventory;