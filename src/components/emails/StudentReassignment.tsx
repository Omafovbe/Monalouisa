import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import { Tailwind } from '@react-email/tailwind'

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export type StudentReassignmentProps = {
  studentName: string
  previousTeacherName: string
  newTeacherName: string
  newTeacherEmail?: string
  matchingSubjects?: string
}

export default function StudentReassignment({
  studentName,
  previousTeacherName,
  newTeacherName,
  newTeacherEmail,
  matchingSubjects,
}: StudentReassignmentProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Important: Your language teacher has been changed at Monalouisa Teaches
      </Preview>
      <Tailwind>
        <Body className='bg-white font-sans'>
          <Container className='mx-auto py-5 px-5 max-w-[600px]'>
            <Heading className='text-2xl font-bold text-center text-gray-800 pt-4'>
              Monalouisa Teaches
            </Heading>
            <Section className='mt-8'>
              <Heading className='text-xl font-semibold text-gray-800 mb-0'>
                Hello {studentName},
              </Heading>

              <Text className='text-gray-700 text-base'>
                We're writing to inform you about an important change to your
                language learning journey. Your teacher has been changed from{' '}
                <strong>{previousTeacherName}</strong> to{' '}
                <strong>{newTeacherName}</strong>.
              </Text>

              <Text className='text-gray-700 text-base'>
                This change has been made to ensure the continuity and quality
                of your language learning experience. All your previous class
                history and learning materials will remain accessible through
                your dashboard.
              </Text>

              <Section className='mt-6 bg-amber-50 p-4 rounded-md border border-amber-200'>
                <Heading className='text-lg font-semibold text-amber-800 mb-2'>
                  Teacher Update
                </Heading>
                <Text className='text-amber-700 mb-2'>
                  <strong>Previous Teacher:</strong> {previousTeacherName}
                </Text>
                <Text className='text-amber-700 mb-0'>
                  <strong>New Teacher:</strong> {newTeacherName}
                </Text>
                {newTeacherEmail && (
                  <Text className='text-amber-700 mt-1 mb-0'>
                    <strong>Contact:</strong> {newTeacherEmail}
                  </Text>
                )}
              </Section>

              {matchingSubjects && matchingSubjects !== 'None' && (
                <Section className='mt-4 bg-green-50 p-4 rounded-md border border-green-200'>
                  <Heading className='text-md font-semibold text-green-800 mb-2'>
                    Matching Subjects
                  </Heading>
                  <Text className='text-green-700 text-sm'>
                    You and your new teacher will continue focusing on:{' '}
                    {matchingSubjects}
                  </Text>
                </Section>
              )}

              <Text className='text-gray-700 text-base mt-6'>
                Your new teacher will be contacting you shortly to introduce
                themselves and discuss your upcoming schedule. You can also log
                in to your student dashboard to view any updates to your class
                schedule.
              </Text>

              <Section className='mt-8 text-center'>
                <Link
                  href={`${baseUrl}/student/dashboard`}
                  className='bg-blue-600 text-white font-bold py-3 px-6 rounded no-underline inline-block'
                >
                  Go to Your Dashboard
                </Link>
              </Section>

              <Hr className='my-6 border-gray-300' />

              <Text className='text-gray-500 text-sm'>
                If you have any questions or concerns about this change, please
                contact our support team at support@monalouisateaches.com.
              </Text>
              <Text className='text-gray-500 text-sm'>
                We appreciate your understanding and are committed to ensuring a
                smooth transition.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
