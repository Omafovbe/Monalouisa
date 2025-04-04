import { Resend } from 'resend'
import { render } from '@react-email/components'
import StudentOnboarding from '@/components/emails/StudentOnboarding'
import AssignedTeacher from '@/components/emails/AssignedTeacher'
import TeacherAssignment from '@/components/emails/TeacherAssignment'
import ClassSchedule from '@/components/emails/ClassSchedule'
import TeacherOnboarding from '@/components/emails/TeacherOnboarding'
import StudentReassignment from '@/components/emails/StudentReassignment'

const resend = new Resend(process.env.RESEND_API_KEY)

// Helper to create calendar links
function generateCalendarLinks(
  title: string,
  description: string,
  location: string,
  startTime: Date,
  endTime: Date
) {
  // Format dates for calendar links
  const startIso = new Date(startTime).toISOString().replace(/-|:|\.\d+/g, '')
  const endIso = new Date(endTime).toISOString().replace(/-|:|\.\d+/g, '')

  // Encode parameters for URLs
  const encodedTitle = encodeURIComponent(title)
  const encodedDesc = encodeURIComponent(description)
  const encodedLocation = encodeURIComponent(location)

  // Google Calendar link
  const googleCalendarLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodedTitle}&details=${encodedDesc}&location=${encodedLocation}&dates=${startIso}/${endIso}`

  // Apple Calendar link (iCal format)
  // For Apple Calendar, we'd typically generate an .ics file, but for email links we'll provide a web link
  const appleCalendarLink = `webcal://calendar.google.com/calendar/ical/simple.ics?text=${encodedTitle}&details=${encodedDesc}&location=${encodedLocation}&dates=${startIso}/${endIso}`

  // Outlook Calendar link
  const outlookCalendarLink = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodedTitle}&body=${encodedDesc}&location=${encodedLocation}&startdt=${new Date(startTime).toISOString()}&enddt=${new Date(endTime).toISOString()}`

  return {
    googleCalendarLink,
    appleCalendarLink,
    outlookCalendarLink,
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    const html = await render(StudentOnboarding({ name }))

    const { data, error } = await resend.emails.send({
      from: 'Monalouisa Teaches <no-reply@monalouisateaches.com>',
      to: email,
      subject: 'Welcome to Monalouisa Teaches',
      html,
    })

    if (error) {
      console.error('Error sending welcome email:', error)
      return { success: false, error: error.message }
    }
    return { success: true, data }
  } catch (error) {
    console.error('Error sending welcome email:', error)
    return { success: false, error }
  }
}

export async function sendTeacherOnboardingEmail(
  email: string,
  name: string,
  password: string
) {
  try {
    const html = await render(TeacherOnboarding({ name, email, password }))

    const { data, error } = await resend.emails.send({
      from: 'Monalouisa Teaches <no-reply@monalouisateaches.com>',
      to: email,
      subject: 'Congratulations! Your Teaching Application is Approved',
      html,
    })

    if (error) {
      console.error('Error sending teacher onboarding email:', error)
      return { success: false, error: error.message }
    }
    return { success: true, data }
  } catch (error) {
    console.error('Error sending teacher onboarding email:', error)
    return { success: false, error }
  }
}

export async function sendTeacherAssignmentEmail(
  teacherEmail: string,
  teacherName: string,
  studentNames: string[],
  teachableSubjects?: string
) {
  try {
    const html = await render(
      TeacherAssignment({
        teacherName,
        studentNames,
        teachableSubjects,
      })
    )

    const { data, error } = await resend.emails.send({
      from: 'Monalouisa Teaches <no-reply@monalouisateaches.com>',
      to: teacherEmail,
      subject: `New Student${studentNames.length > 1 ? 's' : ''} Assigned to You`,
      html,
    })

    if (error) {
      console.error('Error sending teacher assignment email:', error)
      return { success: false, error: error.message }
    }
    return { success: true, data }
  } catch (error) {
    console.error('Error sending teacher assignment email:', error)
    return { success: false, error }
  }
}

export async function sendStudentAssignmentEmail(
  studentEmail: string,
  studentName: string,
  teacherName: string,
  teacherEmail?: string,
  matchingSubjects?: string
) {
  try {
    const html = await render(
      AssignedTeacher({
        studentName,
        teacherName,
        teacherEmail,
        matchingSubjects,
      })
    )

    const { data, error } = await resend.emails.send({
      from: 'Monalouisa Teaches <no-reply@monalouisateaches.com>',
      to: studentEmail,
      subject: 'Your Teacher Has Been Assigned',
      html,
    })

    if (error) {
      console.error('Error sending student assignment email:', error)
      return { success: false, error: error.message }
    }
    return { success: true, data }
  } catch (error) {
    console.error('Error sending student assignment email:', error)
    return { success: false, error }
  }
}

export async function sendClassScheduleEmail(
  studentEmail: string,
  studentName: string,
  teacherName: string,
  className: string,
  subjectName: string,
  startTime: Date,
  endTime: Date
) {
  try {
    // Generate calendar links
    const description = `${className} - ${subjectName} with ${teacherName}`
    const location = 'Online Class - Monalouisa Teaches Platform'

    const { googleCalendarLink, appleCalendarLink, outlookCalendarLink } =
      generateCalendarLinks(
        className,
        description,
        location,
        startTime,
        endTime
      )

    // Render email template
    const html = await render(
      ClassSchedule({
        studentName,
        teacherName,
        className,
        subjectName,
        startTime,
        endTime,
        googleCalendarLink,
        appleCalendarLink,
        outlookCalendarLink,
      })
    )

    // Format date for email subject
    const formattedDate = new Date(startTime).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })

    const formattedTime = new Date(startTime).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })

    // Send email
    const { data, error } = await resend.emails.send({
      from: 'Monalouisa Teaches <no-reply@monalouisateaches.com>',
      to: studentEmail,
      subject: `Class Scheduled: ${subjectName} on ${formattedDate} at ${formattedTime}`,
      html,
    })

    if (error) {
      console.error('Error sending class schedule email:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error sending class schedule email:', error)
    return { success: false, error }
  }
}

export async function sendStudentReassignmentEmail(
  studentEmail: string,
  studentName: string,
  previousTeacherName: string,
  newTeacherName: string,
  newTeacherEmail?: string,
  matchingSubjects?: string
) {
  try {
    const html = await render(
      StudentReassignment({
        studentName,
        previousTeacherName,
        newTeacherName,
        newTeacherEmail,
        matchingSubjects,
      })
    )

    const { data, error } = await resend.emails.send({
      from: 'Monalouisa Teaches <no-reply@monalouisateaches.com>',
      to: studentEmail,
      subject: 'Important: Your Language Teacher Has Changed',
      html,
    })

    if (error) {
      console.error('Error sending student reassignment email:', error)
      return { success: false, error: error.message }
    }
    return { success: true, data }
  } catch (error) {
    console.error('Error sending student reassignment email:', error)
    return { success: false, error }
  }
}
