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
import { format } from 'date-fns'

type ClassScheduleProps = {
  studentName: string
  teacherName: string
  className: string
  subjectName: string
  startTime: Date
  endTime: Date
  googleCalendarLink?: string
  appleCalendarLink?: string
  outlookCalendarLink?: string
}

export default function ClassSchedule({
  studentName,
  teacherName,
  className,
  subjectName,
  startTime,
  endTime,
  googleCalendarLink,
  appleCalendarLink,
  outlookCalendarLink,
}: ClassScheduleProps) {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000')

  const formattedDate = format(new Date(startTime), 'EEEE, MMMM d, yyyy')
  const formattedStartTime = format(new Date(startTime), 'h:mm a')
  const formattedEndTime = format(new Date(endTime), 'h:mm a')
  const duration = Math.round(
    (new Date(endTime).getTime() - new Date(startTime).getTime()) / (1000 * 60)
  )

  return (
    <Html>
      <Head />
      <Preview>
        New class scheduled with {teacherName} on {formattedDate} at{' '}
        {formattedStartTime}
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
            New Class Scheduled!
          </Heading>
          <Section>
            <Text className='text-[14px] leading-[24px] text-[#333]'>
              Hi {studentName},
            </Text>
            <Text className='text-[14px] leading-[24px] text-[#333]'>
              Your teacher, <strong>{teacherName}</strong>, has scheduled a new{' '}
              <strong>{subjectName}</strong> class for you. We&#39;re looking
              forward to your participation!
            </Text>

            <Section className='bg-gray-50 border border-solid border-[#eaeaea] rounded p-[16px] my-[24px]'>
              <Text className='text-[16px] font-bold leading-[24px] text-[#333] m-0'>
                {className}
              </Text>
              <Text className='text-[14px] leading-[24px] text-[#333] mt-[8px] mb-0'>
                <strong>Date:</strong> {formattedDate}
              </Text>
              <Text className='text-[14px] leading-[24px] text-[#333] mt-[4px] mb-0'>
                <strong>Time:</strong> {formattedStartTime} - {formattedEndTime}{' '}
                ({duration} min)
              </Text>
              <Text className='text-[14px] leading-[24px] text-[#333] mt-[4px] mb-0'>
                <strong>Subject:</strong> {subjectName}
              </Text>
              <Text className='text-[14px] leading-[24px] text-[#333] mt-[4px] mb-0'>
                <strong>Teacher:</strong> {teacherName}
              </Text>
            </Section>

            <Text className='text-[14px] leading-[24px] text-[#333]'>
              Please make sure to prepare for your class and be on time. If you
              need to reschedule, please contact your teacher directly.
            </Text>
          </Section>

          {/* Add to Calendar Buttons */}
          <Section className='text-center mt-[24px] mb-[16px]'>
            <Text className='text-[14px] leading-[24px] text-center font-bold text-[#333] mb-[12px]'>
              Add to your calendar:
            </Text>
            <div className='mb-[12px]'>
              {googleCalendarLink && (
                <Button
                  href={googleCalendarLink}
                  className='bg-goldyellow-400 rounded-md text-goldyellow-900 font-medium no-underline text-center px-[12px] py-[8px] cursor-pointer mb-[8px] mx-[4px]'
                >
                  Google Calendar
                </Button>
              )}
              {appleCalendarLink && (
                <Button
                  href={appleCalendarLink}
                  className='bg-gray-200 rounded-md text-gray-800 font-medium no-underline text-center px-[12px] py-[8px] cursor-pointer mb-[8px] mx-[4px]'
                >
                  Apple Calendar
                </Button>
              )}
              {outlookCalendarLink && (
                <Button
                  href={outlookCalendarLink}
                  className='bg-sky-200 rounded-md text-sky-900 font-medium no-underline text-center px-[12px] py-[8px] cursor-pointer mb-[8px] mx-[4px]'
                >
                  Outlook
                </Button>
              )}
            </div>
          </Section>

          <Section className='text-center mt-[24px] mb-[32px]'>
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
    </Html>
  )
}
