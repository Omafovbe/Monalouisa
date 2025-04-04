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

type TeacherAssignmentProps = {
  teacherName: string
  studentNames: string[]
}

export default function TeacherAssignment({
  teacherName,
  studentNames,
}: TeacherAssignmentProps) {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || 'https://monalouisateaches.com'

  return (
    <Html>
      <Head />
      <Preview>
        New student{studentNames.length > 1 ? 's' : ''} assigned to you at
        Monalouisa Teaches.
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
          <Heading className='text-[24px] font-normal text-center p-0 my-[30px] mx-0 text-[#890620]'>
            New Student{studentNames.length > 1 ? 's' : ''} Assigned!
          </Heading>
          <Section>
            <Text className='text-[14px] leading-[24px] text-[#333]'>
              Hi {teacherName},
            </Text>
            <Text className='text-[14px] leading-[24px] text-[#333]'>
              {studentNames.length === 1
                ? `We&#39;re excited to inform you that a new student, ${studentNames[0]}, has been assigned to you.`
                : `We&#39;re excited to inform you that ${studentNames.length} new students have been assigned to you.`}
            </Text>
            {studentNames.length > 1 && (
              <Text className='text-[14px] leading-[24px] text-[#333]'>
                Your new students are:
                <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
                  {studentNames.map((name, index) => (
                    <li key={index}>{name}</li>
                  ))}
                </ul>
              </Text>
            )}
            <Text className='text-[14px] leading-[24px] text-[#333]'>
              Please log in to your dashboard to view your updated student
              roster and schedule. You can now set up classes and begin
              preparing lessons for your new student
              {studentNames.length > 1 ? 's' : ''}.
            </Text>
          </Section>
          <Section className='text-center mt-[32px] mb-[32px]'>
            <Button
              className='bg-goldyellow-400 rounded-md text-goldyellow-900 font-medium no-underline text-center px-[20px] py-[12px] cursor-pointer'
              href={`${baseUrl}/teacher/students`}
            >
              View Your Students
            </Button>
          </Section>
          <Text className='text-[14px] leading-[24px] text-[#333]'>
            Thank you for your dedication to teaching at Monalouisa Teaches. If
            you have any questions or need assistance, please contact our
            support team.
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
    </Html>
  )
}
