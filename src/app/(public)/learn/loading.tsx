export default function Loading() {
  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
      <div className='bg-white p-8 rounded-lg shadow-lg max-w-md w-full'>
        <div className='text-center'>
          <div className='animate-pulse'>
            <div className='h-8 bg-gray-200 rounded w-3/4 mx-auto mb-6'></div>
            <div className='space-y-3'>
              <div className='h-4 bg-gray-200 rounded w-5/6 mx-auto'></div>
              <div className='h-4 bg-gray-200 rounded w-4/6 mx-auto'></div>
            </div>
          </div>

          <div className='mt-8 space-y-4'>
            <div className='h-12 bg-gray-200 rounded animate-pulse'></div>
            <div className='h-12 bg-gray-200 rounded animate-pulse'></div>
          </div>

          <div className='mt-6'>
            <div className='h-4 bg-gray-200 rounded w-2/3 mx-auto animate-pulse'></div>
          </div>
        </div>
      </div>
    </div>
  )
}
