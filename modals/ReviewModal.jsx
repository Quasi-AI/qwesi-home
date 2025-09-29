'use client'

import { StarIcon, Send, X } from 'lucide-react';
import { useEffect } from 'react';

const ReviewModal = ({ 
    isOpen, 
    onClose, 
    ratingForm, 
    setRatingForm, 
    submittingRating, 
    onSubmit,
    ratingError,
    setRatingError
}) => {
    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(e);
    };

    const handleStarClick = (rating) => {
        setRatingForm(prev => ({ ...prev, rating }));
    };

    // Close modal on escape key or outside click
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        const handleBackdropClick = (e) => {
            if (e.target === e.currentTarget) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen, onClose]);

    return (
        <div 
            className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.stopPropagation()}
        >
            <div 
                className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-slate-800">Write a Review</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Your Name
                            </label>
                            <input
                                type="text"
                                value={ratingForm.reviewerName}
                                onChange={(e) => setRatingForm({...ratingForm, reviewerName: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter your name"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Rating
                            </label>
                            <div className="flex gap-1">
                                {Array(5).fill('').map((_, index) => (
                                    <StarIcon
                                        key={index}
                                        size={24}
                                        className={`cursor-pointer transition-colors ${
                                            index < ratingForm.rating ? 'text-yellow-400' : 'text-gray-300'
                                        }`}
                                        fill={index < ratingForm.rating ? '#F59E0B' : '#D1D5DB'}
                                        onClick={() => handleStarClick(index + 1)}
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Comment (Optional)
                            </label>
                            <textarea
                                value={ratingForm.comment}
                                onChange={(e) => setRatingForm({...ratingForm, comment: e.target.value})}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                placeholder="Share your experience with this product..."
                            />
                        </div>

                        {ratingError && (
                            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                                {ratingError}
                            </div>
                        )}

                        {submittingRating && !ratingError && (
                            <div className="text-blue-600 text-sm">Submitting your review...</div>
                        )}

                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={submittingRating}
                                className="flex-1 bg-[#5c3aec] hover:bg-[#5c3aec]/90 text-white py-2 px-4 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <Send size={16} />
                                {submittingRating ? 'Submitting...' : 'Submit Review'}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;
