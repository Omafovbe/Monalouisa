import {
  Container,
  Html,
  Section,
  Text,
  Heading,
  Body,
  Preview,
  Img,
  Head,
  Hr,
  Button,
} from '@react-email/components'

type TeacherOnboardingProps = {
  name: string
  email?: string
  password: string
}

export default function TeacherOnboarding({
  name,
  email,
  password,
}: TeacherOnboardingProps) {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || 'https://monalouisateaches.com'

  return (
    <Html>
      <Head />
      <Preview>
        Congratulations! Your application to teach at Monalouisa Teaches has
        been approved.
      </Preview>
      <Body className='bg-white font-sans my-auto mx-auto'>
        <Container className='border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]'>
          <Section className='mt-[32px]'>
            <Img
              src={`${baseUrl}/mlt_logo.png`}
              alt='Monalouisa Teaches Logo'
              width='170'
              height='50'
              className='my-0 mx-auto'
            />
          </Section>
          <Heading className='text-[24px] text-center font-normal p-0 my-[30px] mx-0 text-[#890620]'>
            Application Approved!
          </Heading>
          <Section>
            <Text className='text-[14px] leading-[24px] text-[#333]'>
              Hi {name},
            </Text>
            <Text className='text-[14px] leading-[24px] text-[#333]'>
              We&#39;re delighted to inform you that your application to become
              a teacher at Monalouisa Teaches has been <strong>approved</strong>
              !
            </Text>
            <Text className='text-[14px] leading-[24px] text-[#333]'>
              We were impressed with your qualifications, experience, and
              teaching approach. We believe you&#39;ll be a valuable addition to
              our teaching team and will make a significant impact on our
              students&#39; language learning journeys.
            </Text>

            <Section className='bg-gray-50 border border-solid border-[#eaeaea] rounded p-[16px] my-[24px]'>
              <Text className='text-[16px] font-bold leading-[24px] text-[#333] m-0'>
                Your Login Credentials:
              </Text>
              <Text className='text-[14px] leading-[24px] text-[#333] mt-[8px] mb-0'>
                <strong>Email:</strong> {email}
              </Text>
              <Text className='text-[14px] leading-[24px] text-[#333] mt-[4px] mb-0'>
                <strong>Password:</strong>{' '}
                <span
                  style={{
                    background: '#f0f0f0',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                  }}
                >
                  {password}
                </span>
              </Text>
              <Text className='text-[12px] leading-[18px] text-[#666] mt-[8px] mb-0 italic'>
                Please change your password after your first login for security
                purposes.
              </Text>
            </Section>

            <Section className='bg-gray-50 border border-solid border-[#eaeaea] rounded p-[16px] my-[24px]'>
              <Text className='text-[16px] font-bold leading-[24px] text-[#333] m-0'>
                Next Steps:
              </Text>
              <Text className='text-[14px] leading-[24px] text-[#333] mt-[8px] mb-0'>
                1. <strong>Log in to your teacher dashboard</strong> using your
                credentials above.
              </Text>
              <Text className='text-[14px] leading-[24px] text-[#333] mt-[4px] mb-0'>
                2. <strong>Complete your profile</strong> with any additional
                information.
              </Text>
              <Text className='text-[14px] leading-[24px] text-[#333] mt-[4px] mb-0'>
                3. <strong>Review teaching resources</strong> in the platform.
              </Text>
              <Text className='text-[14px] leading-[24px] text-[#333] mt-[4px] mb-0'>
                4. <strong>Students will be assigned</strong> to you by our
                admin team shortly.
              </Text>
            </Section>

            <Text className='text-[14px] leading-[24px] text-[#333]'>
              You can now access your teacher dashboard where you can view
              assigned students, schedule classes, and access teaching
              materials.
            </Text>
          </Section>

          <Section className='text-center mt-[32px] mb-[32px]'>
            <Button
              className='bg-goldyellow-400 rounded-md text-goldyellow-900 font-medium no-underline text-center px-[20px] py-[12px] cursor-pointer'
              href={`${baseUrl}/login`}
            >
              Login Now
            </Button>
          </Section>

          <Text className='text-[14px] leading-[24px] text-[#333]'>
            We&#39;ll be conducting an orientation session for new teachers
            soon. Details will be shared in your dashboard and via email.
          </Text>

          <Text className='text-[14px] leading-[24px] text-[#333]'>
            If you have any questions or need assistance, please don&#39;t
            hesitate to contact our teacher support team.
          </Text>

          <Text className='text-[14px] leading-[24px] text-[#333]'>
            Warm regards,
            <br />
            The Monalouisa Teaches Team
          </Text>

          <Hr className='border border-solid border-[#eaeaea] my-[26px] mx-0 w-full' />

          <Text className='text-[12px] leading-[24px] text-[#666] text-center'>
            © {new Date().getFullYear()} Monalouisa Teaches. All rights
            reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
