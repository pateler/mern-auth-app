import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchModal = ({ isOpen, onClose, onSearch }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    // Mock search results
    const mockSearch = (searchQuery) => {
        if (!searchQuery.trim()) return [];

        const mockData = [
            { id: '#ORD-1024', type: 'order', title: 'Order #ORD-1024', subtitle: 'Sufyan Shaikh - ₹2,400' },
            { id: '#ORD-1023', type: 'order', title: 'Order #ORD-1023', subtitle: 'Sanket Patil - ₹1,800' },
            { id: '#ORD-1022', type: 'order', title: 'Order #ORD-1022', subtitle: 'Saurabh Chaudhari - ₹3,200' },
            { id: '#ORD-1021', type: 'order', title: 'Order #ORD-1021', subtitle: 'Abhishek Borude - ₹3,200' },
            { id: '#ORD-1020', type: 'order', title: 'Order #ORD-1020', subtitle: 'Pankaj Jangid - ₹3,200' },
            { id: 'PROD-001', type: 'product', title: 'Nike Air Max 97', subtitle: 'Footwear - ₹12,000' },
            { id: 'PROD-002', type: 'product', title: 'Jordan Hoodie', subtitle: 'Apparel - ₹4,500' },
            { id: 'CUST-001', type: 'customer', title: 'Sufyan Shaikh', subtitle: 'sufyan@example.com' },
            { id: 'CUST-002', type: 'customer', title: 'Sanket Patil', subtitle: 'sanket@example.com' },
        ];

        return mockData.filter(item =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setResults([]);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    useEffect(() => {
        if (query.trim()) {
            setLoading(true);
            const timer = setTimeout(() => {
                const searchResults = mockSearch(query);
                setResults(searchResults);
                setLoading(false);
            }, 300);
            return () => clearTimeout(timer);
        } else {
            setResults([]);
            setLoading(false);
        }
    }, [query]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
            onClose();
        }
    };

    const handleResultClick = (result) => {
        onClose();
        if (result.type === 'order') {
            navigate(`/orders?view=${result.id}`);
        } else if (result.type === 'product') {
            navigate(`/inventory?view=${result.id}`);
        } else {
            // Handle other types
            console.log('Navigating to:', result);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

            {/* Modal */}
            <div className="relative min-h-screen flex items-start justify-center pt-20 px-4">
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
                    {/* Search Input */}
                    <form onSubmit={handleSearch} className="p-4 border-b border-gray-200">
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search for orders, products, customers..."
                                className="w-full pl-10 pr-4 py-3 border-0 focus:ring-0 outline-none text-lg"
                                autoFocus
                            />
                            {query && (
                                <button
                                    type="button"
                                    onClick={() => setQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Results */}
                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                        ) : results.length > 0 ? (
                            <div className="py-2">
                                {results.map((result, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleResultClick(result)}
                                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
                                    >
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold ${result.type === 'order' ? 'bg-blue-100 text-blue-600' :
                                                result.type === 'product' ? 'bg-green-100 text-green-600' :
                                                    'bg-purple-100 text-purple-600'
                                            }`}>
                                            {result.type === 'order' ? 'O' :
                                                result.type === 'product' ? 'P' : 'C'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-800">{result.title}</p>
                                            <p className="text-xs text-gray-500">{result.subtitle}</p>
                                        </div>
                                        <span className="text-xs text-gray-400 capitalize">{result.type}</span>
                                    </button>
                                ))}
                            </div>
                        ) : query.trim() ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No results found for "{query}"</p>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-400">Type to start searching...</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-400">
                        <span>Search for orders, products, or customers</span>
                        <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-300">ESC</kbd>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchModal;