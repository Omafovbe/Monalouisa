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
  Link,
} from '@react-email/components'
import { Tailwind } from '@react-email/tailwind'

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export type AssignedTeacherProps = {
  studentName: string
  teacherName: string
  teacherEmail?: string
  matchingSubjects?: string
}

export default function AssignedTeacher({
  studentName,
  teacherName,
  teacherEmail,
  matchingSubjects,
}: AssignedTeacherProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Good news! {teacherName} has been assigned as your teacher at Monalouisa
        Teaches.
      </Preview>
      <Tailwind>
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
            <Heading className='text-[24px] font-normal text-center p-0 my-[30px] mx-0 text-[#890620]'>
              Your Teacher Has Been Assigned!
            </Heading>
            <Section>
              <Text className='text-[14px] leading-[24px] text-[#333]'>
                Hi {studentName},
              </Text>
              <Text className='text-[14px] leading-[24px] text-[#333]'>
                We&#39;re excited to let you know that{' '}
                <strong>{teacherName}</strong> has been assigned as your
                language teacher at Monalouisa Teaches.
              </Text>
              <Text className='text-[14px] leading-[24px] text-[#333]'>
                Your teacher is highly qualified and ready to guide you through
                your language learning journey. You can now view your upcoming
                classes and schedule in your student dashboard.
              </Text>
              {teacherEmail && (
                <Text className='text-[14px] leading-[24px] text-[#333]'>
                  If you have any specific questions about your lessons, you can
                  contact your teacher directly at: {teacherEmail}
                </Text>
              )}
            </Section>
            {matchingSubjects && (
              <Section className='mt-4 bg-green-50 p-4 rounded-md'>
                <Heading className='text-md font-semibold text-green-800 mb-2'>
                  Matching Subjects
                </Heading>
                <Text className='text-green-700 text-sm'>
                  You and your teacher will be focusing on: {matchingSubjects}
                </Text>
              </Section>
            )}
            <Section className='text-center mt-[32px] mb-[32px]'>
              <Button
                className='bg-goldyellow-400 rounded-md text-goldyellow-900 font-medium no-underline text-center px-[20px] py-[12px] cursor-pointer'
                href={`${baseUrl}/student/schedule`}
              >
                View Your Schedule
              </Button>
            </Section>
            <Text className='text-[14px] leading-[24px] text-[#333]'>
              If you have any questions or need assistance, our support team is
              always here to help.
            </Text>
            <Text className='text-[14px] leading-[24px] text-[#333]'>
              Best regards,
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
      </Tailwind>
    </Html>
  )
}
