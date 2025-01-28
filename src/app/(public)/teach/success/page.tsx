import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SuccessPage() {
  return (
    <div className='min-h-screen mx-auto bg-gradient-to-b from-gray-50 to-white'>
      <PageHeader
        title='Application Submitted'
        breadcrumbs={[{ label: 'Teach', href: '/teach' }, { label: 'Success' }]}
      />

      <section className='w-[calc(100%-68px)] max-w-[1320px] mx-auto px-4 py-20 text-center'>
        <h2 className='text-2xl font-bold mb-4'>Thank You for Applying!</h2>
        <p className='text-gray-600 mb-8'>
          We have received your application and will review it shortly. You will
          receive an email with further instructions.
        </p>
        <Link href='/'>
          <Button>Return to Home</Button>
        </Link>
      </section>
    </div>
  )
}
