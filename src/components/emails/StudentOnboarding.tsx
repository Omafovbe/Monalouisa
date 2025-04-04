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

export default function StudentOnboarding({ name }: { name: string }) {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000')

  return (
    <Html>
      <Head />
      <Preview>
        Welcome to Monalouisa Teaches! Start your learning journey today.
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
            Welcome to <strong>Monalouisa Teaches</strong>!
          </Heading>
          <Section>
            <Text className='text-[14px] leading-[24px] text-[#333]'>
              Hi {name},
            </Text>
            <Text className='text-[14px] leading-[24px] text-[#333]'>
              We&#39;re excited to have you on board and can&#39;t wait to help
              you on your learning journey. Your account has been successfully
              created and is ready to use.
            </Text>
            <Text className='text-[14px] leading-[24px] text-[#333]'>
              You can now access your account and explore our courses designed
              to make language learning engaging and effective.
            </Text>
          </Section>
          <Section className='text-center mt-[32px] mb-[32px]'>
            <Button
              className='bg-goldyellow-400 rounded-md text-goldyellow-900 font-medium no-underline text-center px-[20px] py-[12px] cursor-pointer'
              href={`${baseUrl}/login`}
            >
              Get Started
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
          <Text className='text-[12px] leading-[24px] text-[#666] text-center'>
            If you did not create this account, please contact us immediately.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
