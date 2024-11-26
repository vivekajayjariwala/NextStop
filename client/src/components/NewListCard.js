import { XMarkIcon } from '@heroicons/react/20/solid'

export function NewListCard({ destination, onRemove }) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg mb-2 bg-white">
      <div>
        <h3 className="font-medium">{destination.Destination}</h3>
        <p className="text-sm text-gray-500">{destination.Country}, {destination.Region}</p>
      </div>
      <button
        onClick={() => onRemove(destination._id)}
        className="p-1 hover:bg-gray-100 rounded-full"
      >
        <XMarkIcon className="w-5 h-5 text-gray-500" />
      </button>
    </div>
  )
} 