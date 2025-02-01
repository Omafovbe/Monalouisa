import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center min-h-[100vh] px-4'>
      <h2 className='text-3xl font-bold mb-4'>Page Not Found</h2>
      <p className='text-gray-600 mb-6'>Could not find the requested page</p>
      <Link
        href='/'
        className='px-4 py-2 bg-goldyellow-500 text-black rounded-md hover:bg-goldyellow-600 transition-colors'
      >
        Return Home
      </Link>
    </div>
  )
}
