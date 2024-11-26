import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="bg-white">
      <div className="relative isolate px-8 pt-16 lg:px-10">
        <div className="mx-auto max-w-2xl py-36 sm:py-52 lg:py-60">
          <div className="text-center">
            <h1 className="text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
              Your next travel destination is here
            </h1>
            <p className="mt-8 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
            Explore, save, and share your favorite travel destinations with ease. Next Stop lets you create personalized destination lists, read reviews, and connect with a community of travel enthusiasts.
            </p>
            <div className="mt-12 flex items-center justify-center gap-x-6">
              <Link
                to="/register"
                className="rounded-md bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
