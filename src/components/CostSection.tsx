import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function CostSection({
  pricingPlans,
}: {
  pricingPlans: {
    duration: string
    price: number
    features: string[]
    bestValue: boolean
  }[]
}) {
  return (
    <div className='bg-[#F7F5FF] p-14 text-center'>
      <h1 className='font-bold text-5xl font-m_bold mb-4'>Cost</h1>
      <div className='w-[calc(100%-68px)] max-w-[1320px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {pricingPlans.map((plan, index) => (
          <div
            key={index}
            className={`relative bg-white rounded-xl pt-6 mt-8 flex flex-col justify-center items-center hover:border-goldyellow-300 hover:border-2 hover:shadow-lg ${
              plan.bestValue ? 'border-2 border-goldyellow-300' : ''
            }`}
          >
            {plan.bestValue && (
              <span className='absolute -top-4 left-1/2 transform -translate-x-1/2 bg-goldyellow-50 text-goldyellow-700 border border-goldyellow-300 text-md font-semibold px-3 py-1 rounded-lg'>
                Best Value
              </span>
            )}
            <h3 className='text-xl font-bold mb-4'>{plan.duration}</h3>
            <div className='text-3xl font-bold mb-2'>
              {plan.price}$
              <span className='text-sm text-gray-500'>/lesson</span>
            </div>
            <div className='p-6'>
              <ul className='space-y-3 mb-6'>
                {plan.features.map((feature, i) => (
                  <li key={i} className='flex items-center gap-2'>
                    <svg
                      className='w-5 h-5 text-indigo-600'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                        clipRule='evenodd'
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className='w-full'>TRY FOR FREE</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
