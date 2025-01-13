export function TestimonialsSection() {
  return (
    <section className='bg-[#F8F9FF] py-16'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-[#2D3436] mb-4'>
            What Our Students Say
          </h2>
          <p className='text-gray-600 max-w-2xl mx-auto'>
            Discover how our platform has helped students achieve their learning
            goals.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {[
            {
              name: 'Alex Thompson',
              role: 'UI/UX Student',
              image: '/author.png',
              quote:
                'The instructors are incredibly knowledgeable and supportive. I have learned more in 3 months than I did in a year of self-study.',
            },
            {
              name: 'Maria Garcia',
              role: 'Web Development Student',
              image: '/author.png',
              quote:
                "The platform's flexibility allowed me to learn at my own pace while working full-time. The community support is amazing!",
            },
            {
              name: 'James Wilson',
              role: 'Digital Marketing Student',
              image: '/author.png',
              quote:
                'The practical projects and real-world applications have helped me build a strong portfolio. I landed my dream job thanks to this platform!',
            },
          ].map((testimonial, index) => (
            <div key={index} className='bg-white p-6 rounded-xl shadow-sm'>
              <div className='flex items-center gap-4 mb-4'>
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className='w-12 h-12 rounded-full object-cover'
                />
                <div>
                  <h3 className='font-bold'>{testimonial.name}</h3>
                  <p className='text-gray-600 text-sm'>{testimonial.role}</p>
                </div>
              </div>
              <p className='text-gray-600'>&#34;{testimonial.quote}&#34;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
