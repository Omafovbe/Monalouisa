import { GraduationCap } from 'lucide-react'

export function InstructorsSection() {
  return (
    <section className='container mx-auto px-4 py-16'>
      <div className='text-center mb-12'>
        <h2 className='text-3xl font-bold text-[#2D3436] mb-4'>
          Expert Instructors
        </h2>
        <p className='text-gray-600 max-w-2xl mx-auto'>
          Learn from the best. Our instructors are industry experts with years
          of practical experience.
        </p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
        {/* Instructor Cards */}
        {[
          {
            name: 'Sarah Johnson',
            role: 'UI/UX Design',
            courses: 12,
            students: '1.2k',
            image: '/author.png',
          },
          {
            name: 'Michael Chen',
            role: 'Web Development',
            courses: 15,
            students: '2.5k',
            image: '/author.png',
          },
          {
            name: 'Emily Rodriguez',
            role: 'Digital Marketing',
            courses: 8,
            students: '950',
            image: '/author.png',
          },
          {
            name: 'David Kim',
            role: 'Mobile Development',
            courses: 10,
            students: '1.5k',
            image: '/author.png',
          },
        ].map((instructor, index) => (
          <div
            key={index}
            className='bg-white rounded-xl p-6 text-center shadow-sm'
          >
            <div className='relative w-24 h-24 mx-auto mb-4'>
              <img
                src={instructor.image}
                alt={instructor.name}
                className='rounded-full object-cover w-full h-full'
              />
              <div className='absolute -right-2 -bottom-2 bg-[#6C5CE7] text-white p-2 rounded-full'>
                <GraduationCap className='w-4 h-4' />
              </div>
            </div>
            <h3 className='font-bold text-lg mb-1'>{instructor.name}</h3>
            <p className='text-gray-600 text-sm mb-3'>{instructor.role}</p>
            <div className='flex justify-center gap-4 text-gray-400'>
              <span>{instructor.courses} Courses</span>
              <span>•</span>
              <span>{instructor.students} Students</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
