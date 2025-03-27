'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

// Type definitions
interface BillingOption {
  type: string
  discounts: string
  benefits: string[]
}

interface Package {
  packageName: string
  monthlyCost: string
  numberOfLessons: string
  lessonDuration: string
  billingOptions: BillingOption[]
}

interface PricingTableProps {
  data: {
    packages: Package[]
  }
}

const PricingTable: React.FC<PricingTableProps> = ({ data }) => {
  const [activeBilling, setActiveBilling] = useState<'standard' | 'premium'>(
    'standard'
  )

  return (
    <div className='container mx-auto px-4 py-12'>
      <motion.h1
        className='text-4xl font-bold text-center mb-12'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        Language Learning Packages
      </motion.h1>

      {/* Billing Tabs */}
      <div className='flex mb-6 w-72 mx-auto rounded-lg bg-white p-3 gap-2 relative'>
        {(['standard', 'premium'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setActiveBilling(type)}
            className={`flex-1 py-2 text-lg font-bold rounded-md relative z-10 transition-colors ${
              activeBilling === type
                ? 'text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}

            {activeBilling === type && (
              <motion.div
                layoutId='activeTab'
                className='absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-500 rounded-md -z-10'
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode='wait'>
        <motion.div
          className='grid grid-cols-1 md:grid-cols-3 gap-8'
          key={activeBilling}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }} // Changed exit y position to match initial
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          {data.packages.map((pkg, index) => {
            const activeOption = pkg.billingOptions.find((opt) =>
              opt.type.toLowerCase().includes(activeBilling)
            )

            if (!activeOption) return null

            const priceValues = pkg.monthlyCost
              .split(' - ')
              .map((s) => parseFloat(s.replace(/[^0-9.]/g, '')))
            const [minCost, maxCost] = priceValues
            const cost = activeBilling === 'standard' ? minCost : maxCost

            return (
              <motion.div
                key={`${pkg.packageName}-${activeBilling}`}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }} // Changed from whileInView to animate
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: 'backOut',
                }}
              >
                <PackageCard
                  pkg={pkg}
                  cost={cost}
                  activeOption={activeOption}
                />
              </motion.div>
            )
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

interface PackageCardProps {
  pkg: Package
  cost: number
  activeOption: BillingOption
}

const PackageCard: React.FC<PackageCardProps> = ({
  pkg,
  cost,
  activeOption,
}) => {
  return (
    <motion.div
      className='bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow'
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <div className='p-6 bg-gray-50 border-b border-gray-200'>
        <motion.h2
          className='text-2xl font-bold text-center mb-2 text-gray-800'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {pkg.packageName}
        </motion.h2>

        <motion.p
          className='text-center text-gray-600 mb-4'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {pkg.numberOfLessons} • {pkg.lessonDuration}
        </motion.p>

        <motion.div
          className='text-center mb-6'
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <span className='text-2xl font-bold text-korma'>
            {cost} USD / Month
          </span>
        </motion.div>

        <motion.div
          className='text-center mb-6'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className='text-sm text-goldyellow-700 font-medium'>
            {activeOption.discounts}
          </p>
        </motion.div>
      </div>

      {/* Benefits Section */}
      <motion.div
        className='p-6'
        initial='hidden'
        animate='visible'
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              when: 'beforeChildren',
            },
          },
        }}
      >
        {activeOption.benefits.map((benefit, index) => (
          <motion.div
            key={`benefit-${index}`}
            className='flex items-center text-gray-700 mb-3'
            variants={{
              hidden: { opacity: 0, x: -10 },
              visible: {
                opacity: 1,
                x: 0,
                transition: {
                  type: 'spring',
                  stiffness: 200,
                  damping: 20,
                },
              },
            }}
          >
            <motion.svg
              className='w-5 h-5 text-goldyellow-900 shrink-0 mt-1 mr-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: index * 0.1 }}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M5 13l4 4L19 7'
              />
            </motion.svg>
            <motion.span
              className='text-base'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              {benefit}
            </motion.span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

export default PricingTable
