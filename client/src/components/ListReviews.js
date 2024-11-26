import { UserCircleIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/20/solid';

export function ListReviews({ reviews }) {
  return (
    <div className="mt-6 space-y-4">
      <h4 className="font-medium text-gray-900">Reviews</h4>
      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="border-t pt-4">
              <div className="flex items-center gap-2">
                <UserCircleIcon className="h-6 w-6 text-gray-400" />
                <span className="font-medium text-gray-900">
                  {review.userId.username}
                </span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              {review.comment && (
                <p className="mt-2 text-gray-600">{review.comment}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 