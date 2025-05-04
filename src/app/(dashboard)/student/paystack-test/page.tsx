'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { initializePaystackTransaction } from '@/actions/paystack-actions'
import { useToast } from '@/hooks/use-toast'

const packages = [
  {
    name: 'Beginner Package',
    price: 5000,
    features: [
      'Access to basic courses',
      '1 hour of live tutoring per week',
      'Basic support',
    ],
  },
  {
    name: 'Intermediate Package',
    price: 10000,
    features: [
      'Access to all courses',
      '3 hours of live tutoring per week',
      'Priority support',
      'Progress tracking',
    ],
  },
  {
    name: 'Advanced Package',
    price: 15000,
    features: [
      'Access to all courses',
      'Unlimited live tutoring',
      '24/7 priority support',
      'Advanced progress tracking',
      'Personalized learning plan',
    ],
  },
]

export default function PaystackTestPage() {
  const [selectedPackage, setSelectedPackage] = useState('Beginner Package')
  const [billingType, setBillingType] = useState('standard')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handlePaystackPayment = async () => {
    try {
      setIsLoading(true)
      const { url } = await initializePaystackTransaction(
        'cm6dch1ac0001nv401qh3qprc',
        selectedPackage,
        billingType
      )
      window.location.href = url
    } catch (error) {
      console.log(error)
      toast({
        title: 'Error',
        description: 'Failed to initialize Paystack payment',
        variant: 'destructive',
      })
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='container mx-auto py-8'>
      <h1 className='text-3xl font-bold mb-8'>Paystack Payment Test</h1>

      <div className='mb-8'>
        <Tabs defaultValue='standard' onValueChange={setBillingType}>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='standard'>Standard</TabsTrigger>
            <TabsTrigger value='premium'>Premium</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {packages.map((pkg) => (
          <Card
            key={pkg.name}
            className={`${
              selectedPackage === pkg.name ? 'border-primary' : ''
            }`}
          >
            <CardHeader>
              <CardTitle className='capitalize'>{pkg.name}</CardTitle>
              <CardDescription>
                ₦
                {(
                  pkg.price * (billingType === 'yearly' ? 12 * 0.8 : 1)
                ).toLocaleString()}
                /{billingType}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className='space-y-2 mb-6'>
                {pkg.features.map((feature, index) => (
                  <li key={index} className='flex items-center'>
                    <svg
                      className='w-4 h-4 mr-2 text-green-500'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className='w-full'
                variant={selectedPackage === pkg.name ? 'default' : 'outline'}
                onClick={() => setSelectedPackage(pkg.name)}
              >
                {selectedPackage === pkg.name ? 'Selected' : 'Select'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className='mt-8 flex justify-center'>
        <Button
          onClick={handlePaystackPayment}
          disabled={isLoading}
          className='bg-[#0AB4D1] hover:bg-[#0AB4D1]/90'
        >
          {isLoading ? 'Processing...' : 'Pay with Paystack'}
        </Button>
      </div>
    </div>
  )
}
