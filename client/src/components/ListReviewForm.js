import { useState } from 'react';
import { StarIcon } from '@heroicons/react/20/solid';
import config from '../config/config';
import { sanitizeFormData } from '../utils/sanitizer';

export function ListReviewForm({ listId, onReviewSubmitted }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const sanitizedData = sanitizeFormData({
        rating,
        comment
      });

      const response = await fetch(`${config.api.baseUrl}/api/lists/${listId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify(sanitizedData)
      });

      if (!response.ok) throw new Error('Failed to submit review');
      
      setRating(0);
      setComment('');
      onReviewSubmitted();
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="focus:outline-none"
          >
            <StarIcon
              className={`h-6 w-6 ${
                star <= (hoveredRating || rating)
                  ? 'text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
      
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment (optional)"
        className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        rows="3"
      />
      
      <button
        type="submit"
        disabled={!rating}
        className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 disabled:opacity-50"
      >
        Submit Review
      </button>
    </form>
  );
} 