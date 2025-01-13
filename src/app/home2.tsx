import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { BookOpen, Users, Calendar, Award, Play } from 'lucide-react'

const LandingPage = () => {
  const ageOptions = Array.from({ length: 9 }, (_, i) => i + 4)

  const steps = [
    {
      icon: <BookOpen className='w-8 h-8 text-goldyellow-600' />,
      title: 'Take Assessment',
      description:
        "Complete a quick quiz to help us understand your child's current level and learning goals",
    },
    {
      icon: <Users className='w-8 h-8 text-goldyellow-600' />,
      title: 'Meet Your Teacher',
      description:
        'Get matched with experienced teachers who specialize in engaging young learners',
    },
    {
      icon: <Calendar className='w-8 h-8 text-goldyellow-600' />,
      title: 'Schedule Classes',
      description:
        "Choose convenient time slots that fit your child's schedule",
    },
    {
      icon: <Award className='w-8 h-8 text-goldyellow-600' />,
      title: 'Start Learning',
      description:
        "Begin your child's learning journey with personalized lessons and engaging activities",
    },
  ]

  const features = [
    {
      icon: '🎯',
      title: 'Language immersion',
    },
    {
      icon: '🎖️',
      title: 'Experienced teachers',
    },
    {
      icon: '🤝',
      title: 'From simple to complex',
    },
    {
      icon: '💻',
      title: 'Lessons from home',
    },
    {
      icon: '🎈',
      title: 'Age-appropriate programme',
    },
    {
      icon: '🎓',
      title: 'European standard of education',
    },
    {
      icon: '🌍',
      title: 'Speaking practice in groups',
    },
  ]

  const pricingPlans = [
    {
      duration: '1 month',
      price: '11.8',
      features: [
        'Building confidence',
        'Fun interactive lessons',
        'Priority customer support',
      ],
      savings: null,
      bestValue: false,
    },
    {
      duration: '3 months',
      price: '10.1',
      features: [
        'Building confidence',
        'Fun interactive lessons',
        'Priority customer support',
      ],
      savings: '14%',
      bestValue: false,
    },
    {
      duration: '6 months',
      price: '9.2',
      features: [
        'Achieving fluency',
        'Fun interactive lessons',
        'Priority customer support',
      ],
      savings: '22%',
      bestValue: false,
    },
    {
      duration: '12 months',
      price: '8.9',
      features: [
        'Mastering English',
        'Fun interactive lessons',
        'Priority customer support',
      ],
      savings: '24%',
      bestValue: true,
    },
  ]

  return (
    <div className='min-h-screen bg-goldyellow-400 font-m_reg pt-10'>
      <nav className='bg-white w-[calc(100%-68px)] max-w-[1320px]  sticky top-4 shadow-lg rounded-full mx-auto px-6 py-3 flex items-center justify-between z-50'>
        <h1 className='text-xl font-m_bold'>Monalouisa Teaches</h1>

        <div className='flex items-center gap-4'>
          <span>Classes</span>
          <span>Programs</span>
          <span>Teachers</span>
          <span>Pricing</span>
        </div>
        <div className='flex  gap-4'>
          <Button variant='outline'>Try Free Class</Button>
          <Button>Sign In</Button>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <div className='w-[calc(100%-68px)] max-w-[1320px] mx-auto pl-8 pr-4 py-12 flex flex-col md:flex-row items-center justify-between'>
          <div className='max-w-xl font-m_bold flex flex-col items-center md:items-start'>
            <span className='text-[#967117]'>ONLINE LEARNING PLATFORM</span>
            <h1 className='text-6xl font-bold text-center md:text-left text-white mt-4 mb-6'>
              Discover the perfect
              <span className='text-[#890620] block'>learning path</span>
              for your child
            </h1>
            <p className='text-[#967117] text-[1.2rem]  mb-8'>
              Take our assessment quiz to receive a personalized learning
              recommendation
            </p>

            <div className='bg-white max-w-[460px] px-6 py-8 rounded-2xl'>
              <h3 className='text-xl text-[#262626] font-semibold mb-4 text-center'>
                Child&#39;s age
              </h3>
              <div className='flex flex-wrap gap-4 justify-center'>
                {ageOptions.map((age) => (
                  <button
                    key={age}
                    className='w-14 h-14 rounded-full border-2 border-goldyellow-300 hover:border-goldyellow-600 
                             flex items-center transition-colors hover:bg-goldyellow-600 hover:text-white duration-500 delay-100 ease-in-out justify-center font-medium'
                  >
                    {age}
                  </button>
                ))}
                <button
                  className='w-14 h-14 rounded-full border-2 border-goldyellow-300 hover:border-goldyellow-600 
                                flex items-center justify-center font-medium transition-colors'
                >
                  13+
                </button>
              </div>
            </div>
          </div>

          <div className='relative'>
            <div className='p-4 rounded-2xl shadow-lg transform rotate-3'>
              <Image
                src='/boy_smiles.png'
                alt='Learning illustration'
                width={500}
                height={250}
                className='rounded-xl'
              />
              <div className='absolute -top-4 -right-4'>
                <div className='bg-goldyellow-100 p-2 rounded-lg'>
                  <svg
                    className='w-6 h-6 text-goldyellow-500'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9'
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Process Steps Section */}
        <div className='bg-white py-16'>
          <div className='container mx-auto px-4'>
            <div className='text-center mb-12'>
              <h2 className='text-3xl font-bold mb-4'>Getting Started</h2>
              <p className='text-gray-600 max-w-2xl mx-auto'>
                Our simple process makes it easy to get your child started on
                their learning journey
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
              {steps.map((step, index) => (
                <div
                  key={index}
                  className='bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow'
                >
                  <div className='bg-goldyellow-100 w-16 h-16 rounded-full flex items-center justify-center mb-4'>
                    {step.icon}
                  </div>
                  <h3 className='text-xl font-semibold mb-2'>{step.title}</h3>
                  <p className='text-gray-600'>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className='bg-gray-50 py-16 relative'>
          <div className='absolute top-0 left-0 right-0'>
            <svg viewBox='0 0 1440 100' className='w-full'>
              <path
                d='M0,0 C480,100 960,100 1440,0 L1440,0 L0,0 Z'
                fill='#84cc16'
                opacity='0.2'
              />
            </svg>
          </div>

          <div className='container mx-auto px-4'>
            <h2 className='text-5xl font-bold mb-12 text-center'>
              How it works
              {/* Underline SVG */}
              <div className='flex justify-center'>
                <Image
                  className='w-full max-w-[300px]'
                  alt='underline'
                  width={100}
                  height={5}
                  src='/underline.svg'
                />
              </div>
            </h2>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
              <div className='space-y-6'>
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className='flex items-center gap-4 text-lg hover:text-indigo-600 transition-colors'
                  >
                    <span className='w-8 h-8 flex items-center justify-center text-2xl'>
                      {feature.icon}
                    </span>
                    <span className='text-indigo-700'>{feature.title}</span>
                  </div>
                ))}
              </div>

              <div className='relative'>
                <div className='rounded-2xl overflow-hidden bg-gray-100'>
                  <Image
                    src='/api/placeholder/600/400'
                    alt='Teacher introduction'
                    className='w-full h-full object-cover'
                  />
                  <div className='absolute inset-0 bg-black/40 flex items-center justify-center'>
                    <button className='w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-300 transition-colors'>
                      <Play className='w-8 h-8 text-white' />
                    </button>
                  </div>
                  <div className='absolute bottom-4 left-4 bg-indigo-900/80 text-white p-2 rounded'>
                    <div className='text-lg font-semibold'>Adrienne</div>
                    <div className='text-sm text-gray-200'>
                      teacher & methodologist
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cost Section */}
        <div className='bg-[#F7F5FF] p-14 text-center'>
          <h1 className='font-bold text-5xl font-m_bold mb-4'>Cost</h1>
          <div className='w-[calc(100%-68px)]  max-w-[1320px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 '>
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
                  <Button className='w-full '>TRY FOR FREE</Button>
                </div>
                {/* <div className='text-center bg-green-100 w-full p-7 rounded-b-xl'>
                  <span className='text-sm'>
                    1 month of FREE speaking groups
                  </span>
                </div> */}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default LandingPage
