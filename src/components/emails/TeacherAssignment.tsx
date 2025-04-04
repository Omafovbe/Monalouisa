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
  Link,
} from '@react-email/components'
import { Tailwind } from '@react-email/tailwind'

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : process.env.NEXT_PUBLIC_APP_URL

export type TeacherAssignmentProps = {
  teacherName: string
  studentNames: string[]
  teachableSubjects?: string
}

export default function TeacherAssignment({
  teacherName,
  studentNames,
  teachableSubjects,
}: TeacherAssignmentProps) {
  // const studentList = studentNames.map((name) => `- ${name}`).join('\n')

  return (
    <Html>
      <Head />
      <Preview>
        New student{studentNames.length > 1 ? 's' : ''} assigned to you!
      </Preview>
      <Tailwind>
        <Body className='bg-white font-sans'>
          <Container className='mx-auto py-5 px-5'>
            <Section className='mt-[32px]'>
              <Img
                src={`${baseUrl}/mlt_logo.png`}
                alt='Monalouisa Teaches Logo'
                width='170'
                height='50'
                className='my-0 mx-auto'
              />
            </Section>
            <Heading className='text-2xl font-bold text-center text-gray-800 pt-4'>
              Monalouisa Teaches
            </Heading>
            <Section className='mt-8'>
              <Heading className='text-xl font-semibold text-gray-800 mb-0'>
                Hello {teacherName},
              </Heading>
              <Text className='text-gray-700 text-base'>
                We&apos;re excited to inform you that you have been assigned{' '}
                {studentNames.length > 1
                  ? `${studentNames.length} new students`
                  : 'a new student'}
                !
              </Text>

              {teachableSubjects && (
                <Section className='mb-6 bg-blue-50 p-4 rounded-md'>
                  <Heading className='text-md font-semibold text-blue-800 mb-2'>
                    Your Teaching Subjects
                  </Heading>
                  <Text className='text-blue-700 text-sm'>
                    {teachableSubjects}
                  </Text>
                </Section>
              )}

              <Section className='mt-6'>
                <Heading className='text-lg font-semibold text-gray-800 mb-2'>
                  Your New Student{studentNames.length > 1 ? 's' : ''}:
                </Heading>
                <Section className='pl-4 border-l-4 border-gray-200'>
                  {studentNames.map((name, index) => (
                    <Text key={index} className='text-gray-700 text-base mb-1'>
                      • {name}
                    </Text>
                  ))}
                </Section>
              </Section>

              <Text className='text-gray-700 text-base mt-6'>
                Please log in to your teacher dashboard to view more details
                about your assigned student{studentNames.length > 1 ? 's' : ''}{' '}
                and to start scheduling lessons.
              </Text>

              <Section className='mt-8 text-center'>
                <Link
                  href={`${baseUrl}/teacher/dashboard`}
                  className='bg-blue-600 text-white font-bold py-3 px-6 rounded no-underline inline-block'
                >
                  Go to Your Dashboard
                </Link>
              </Section>

              <Hr className='my-6 border-gray-300' />

              <Text className='text-gray-500 text-sm'>
                If you have any questions or need assistance, please contact our
                support team at support@monalouisateaches.com.
              </Text>
              <Text className='text-gray-500 text-sm'>
                Thank you for being part of Monalouisa Teaches!
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
