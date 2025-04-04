'use server'
import db from '@/lib/db'
import { hash } from 'bcryptjs'
import { signIn } from '@/lib/auth'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { ApplicationStatus } from '@prisma/client'
import { nanoid } from 'nanoid'
import {
  sendWelcomeEmail,
  sendTeacherAssignmentEmail,
  sendStudentAssignmentEmail,
  sendClassScheduleEmail,
  sendTeacherOnboardingEmail,
  // sendStudentReassignmentEmail,
} from '@/lib/email'

// Add this function to hash passwords
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10
  return await hash(password, saltRounds)
}

export async function registerUser(
  email: string,
  password: string,
  name?: string,
  role: 'STUDENT' | 'TEACHER' | 'ADMIN' = 'STUDENT'
) {
  try {
    // Validate input
    if (!email || !password) {
      return { error: 'Missing required fields', status: 'error' }
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { error: 'User already exists', status: 'error' }
    }

    // Create user and role-specific record in a transaction
    const result = await db.$transaction(async (tx) => {
      // Create the user
      const hashedPassword = await hashPassword(password)
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role,
        },
      })

      // Create role-specific record based on user role
      switch (role) {
        case 'STUDENT':
          await tx.student.create({
            data: {
              userId: user.id,
            },
          })
          break
        case 'TEACHER':
          await tx.teacher.create({
            data: {
              userId: user.id,
              status: 'PENDING',
            },
          })
          break
        case 'ADMIN':
          await tx.admin.create({
            data: {
              userId: user.id,
            },
          })
          break
      }

      return user
    })

    await sendWelcomeEmail(email, name || email.split('@')[0])

    return { success: true, user: result }
  } catch (error) {
    console.log('Error creating user:', error)
    return { error: 'Error creating user', status: 'error' }
  }
}

export async function signInAction() {
  const callbackUrl = (await headers()).get('x-url') || '/'
  await signIn('login', { callbackUrl })
}

export async function submitTeacherApplication(formData: {
  name: string
  email: string
  phone: string
  qualifications: string
  yearsOfExperience: number
  preferredAgeGroup: string
  teachingStyle: string
  teachableSubjects: string
  videoUrl: string
}) {
  try {
    // Check if user/application already exists
    const existingUser = await db.user.findUnique({
      where: { email: formData.email },
    })

    if (existingUser) {
      return {
        success: false,
        error: 'An application with this email already exists',
      }
    }

    // Create user with teacher role
    const user = await db.user.create({
      data: {
        name: formData.name,
        email: formData.email,
        role: 'TEACHER',
      },
    })

    // Create teacher profile
    const teacher = await db.teacher.create({
      data: {
        userId: user.id,
        phone: formData.phone,
        status: 'PENDING',
      },
    })

    // Create teacher application
    const application = await db.teacherApplication.create({
      data: {
        teacherId: teacher.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        qualifications: formData.qualifications,
        yearsOfExperience: formData.yearsOfExperience,
        preferredAgeGroup: formData.preferredAgeGroup,
        teachingStyle: formData.teachingStyle,
        teachableSubjects: formData.teachableSubjects,
        videoUrl: formData.videoUrl,
        status: 'PENDING',
      },
    })

    revalidatePath('/admin/applications')
    return {
      success: true,
      data: application,
      message: 'Application submitted successfully',
    }
  } catch (error) {
    console.error('Application submission error:', error)
    return {
      success: false,
      error: 'Error submitting application. Please try again.',
    }
  }
}

// Get all applications
export async function getTeacherApplications() {
  try {
    const applications = await db.teacherApplication.findMany({
      include: {
        teacher: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return { applications }
  } catch (error) {
    console.error('Error fetching applications:', error)
    return { error: 'Failed to fetch applications' }
  }
}

// Get single application
export async function getTeacherApplication(id: number) {
  try {
    const application = await db.teacherApplication.findUnique({
      where: { id },
      include: {
        teacher: true,
      },
    })
    return { application }
  } catch (error) {
    console.error('Error fetching application:', error)
    return { error: 'Failed to fetch application' }
  }
}

// Update application status
export async function updateApplicationStatus(
  id: number,
  status: 'APPROVED' | 'REJECTED'
) {
  try {
    let generatedPassword = ''
    let result

    // Use a transaction to update both models
    if (status === 'APPROVED') {
      // Generate a secure random password
      generatedPassword = nanoid(12)
      const hashedPassword = await hashPassword(generatedPassword)

      // Use transaction for all updates
      result = await db.$transaction(async (tx) => {
        // First update the application
        const application = await tx.teacherApplication.update({
          where: { id },
          data: {
            status,
            updatedAt: new Date(),
          },
          include: {
            teacher: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        })

        // Then update the teacher's status
        await tx.teacher.update({
          where: { id: application.teacherId },
          data: {
            status,
            hireDate: new Date(),
          },
        })

        // Update the user's password if they don't have one
        if (application.teacher?.user?.id) {
          await tx.user.update({
            where: { id: application.teacher.user.id },
            data: {
              password: hashedPassword,
            },
          })
        }

        return application
      })
    } else {
      // For rejected applications, just update the status
      result = await db.$transaction(async (tx) => {
        // First update the application
        const application = await tx.teacherApplication.update({
          where: { id },
          data: {
            status,
            updatedAt: new Date(),
          },
          include: {
            teacher: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        })

        // Then update the teacher's status
        await tx.teacher.update({
          where: { id: application.teacherId },
          data: {
            status,
          },
        })

        return application
      })
    }

    // Send teacher onboarding email if application is approved
    if (status === 'APPROVED' && result.teacher?.user?.email) {
      await sendTeacherOnboardingEmail(
        result.teacher.user.email,
        result.teacher.user.name || result.name || 'Teacher',
        generatedPassword
      )
    }

    revalidatePath('/admin/applications')
    return { success: true, application: result }
  } catch (error) {
    console.error('Error updating application status:', error)
    return { error: 'Failed to update application status' }
  }
}

// Get all teachers with optional status filter
export async function getTeachers(status?: ApplicationStatus) {
  try {
    const teachers = await db.teacher.findMany({
      where: status ? { status } : undefined,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        teacherApplication: {
          select: {
            yearsOfExperience: true,
            preferredAgeGroup: true,
            teachableSubjects: true,
          },
        },
        _count: {
          select: {
            students: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })
    return { teachers, error: null }
  } catch (error) {
    console.error('Error fetching teachers:', error)
    return { teachers: [], error: 'Failed to fetch teachers' }
  }
}

// Student Management
export async function getStudents() {
  try {
    const students = await db.student.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        teachers: {
          include: {
            teacher: {
              include: {
                user: {
                  select: {
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return { students, error: null }
  } catch (error) {
    console.error('Error fetching students:', error)
    return { students: [], error: 'Failed to fetch students' }
  }
}

// Subject Management
export async function getSubjects() {
  try {
    const subjects = await db.subject.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return { subjects, error: null }
  } catch (error) {
    console.error('Error fetching subjects:', error)
    return { subjects: [], error: 'Failed to fetch subjects' }
  }
}

export async function addSubject({
  name,
  description,
}: {
  name: string
  description: string
}) {
  try {
    // Check if subject already exists
    const existingSubject = await db.subject.findUnique({
      where: { name },
    })

    if (existingSubject) {
      return {
        success: false,
        error: 'A subject with this name already exists',
      }
    }

    // Create new subject
    const subject = await db.subject.create({
      data: {
        name,
        description,
      },
    })

    return {
      success: true,
      data: subject,
    }
  } catch (error) {
    console.error('Error creating subject:', error)
    return {
      success: false,
      error: 'Failed to create subject',
    }
  }
}

export async function updateSubject(
  id: number,
  {
    name,
    description,
  }: {
    name: string
    description: string
  }
) {
  try {
    // Check if another subject with the same name exists
    const existingSubject = await db.subject.findFirst({
      where: {
        name,
        NOT: {
          id,
        },
      },
    })

    if (existingSubject) {
      return {
        success: false,
        error: 'A subject with this name already exists',
      }
    }

    // Update subject
    const subject = await db.subject.update({
      where: { id },
      data: {
        name,
        description,
      },
    })

    return {
      success: true,
      data: subject,
    }
  } catch (error) {
    console.error('Error updating subject:', error)
    return {
      success: false,
      error: 'Failed to update subject',
    }
  }
}

// Function to sync existing users with their role-specific tables
export async function syncExistingUsers() {
  try {
    // Find users who have a role but don't have corresponding role-specific records
    const users = await db.user.findMany({
      where: {
        OR: [
          {
            role: 'STUDENT',
            student: null,
          },
          {
            role: 'TEACHER',
            teacher: null,
          },
          {
            role: 'ADMIN',
            admin: null,
          },
        ],
      },
    })

    const results = await Promise.all(
      users.map(async (user) => {
        try {
          switch (user.role) {
            case 'STUDENT':
              // Check if student record doesn't exist
              const existingStudent = await db.student.findUnique({
                where: { userId: user.id },
              })
              if (!existingStudent) {
                await db.student.create({
                  data: { userId: user.id },
                })
              }
              break

            case 'TEACHER':
              // Check if teacher record doesn't exist
              const existingTeacher = await db.teacher.findUnique({
                where: { userId: user.id },
              })
              if (!existingTeacher) {
                await db.teacher.create({
                  data: {
                    userId: user.id,
                    status: 'PENDING',
                  },
                })
              }
              break

            case 'ADMIN':
              // Check if admin record doesn't exist
              const existingAdmin = await db.admin.findUnique({
                where: { userId: user.id },
              })
              if (!existingAdmin) {
                await db.admin.create({
                  data: { userId: user.id },
                })
              }
              break
          }
          return { success: true, userId: user.id }
        } catch (error) {
          return { success: false, userId: user.id, error }
        }
      })
    )

    return {
      success: true,
      results,
      message: 'User synchronization completed',
    }
  } catch (error) {
    console.error('Error syncing users:', error)
    return {
      success: false,
      error: 'Failed to sync users',
    }
  }
}

export async function assignStudentsToTeacher(
  teacherId: number,
  studentIds: string[]
) {
  try {
    if (!teacherId || !studentIds.length) {
      return { error: 'Teacher ID and at least one student ID are required' }
    }

    // Find the teacher to get their name, email, and teachable subjects
    const teacher = await db.teacher.findUnique({
      where: { id: teacherId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        teacherApplication: {
          select: {
            teachableSubjects: true,
          },
        },
      },
    })

    if (!teacher) {
      return { error: 'Teacher not found' }
    }

    // Parse teachable subjects
    const teachableSubjects = teacher.teacherApplication?.teachableSubjects
      ? teacher.teacherApplication.teachableSubjects
          .split(',')
          .map((s) => s.trim())
      : []

    // Find all students to get their names, emails, and enrolled subjects
    const students = await db.student.findMany({
      where: {
        userId: {
          in: studentIds,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        StudentsOnSubjects: {
          include: {
            subject: true,
          },
        },
      },
    })

    // Create the student-teacher relationships in the database
    const results = await db.studentsOnTeachers.createMany({
      data: studentIds.map((studentId) => ({
        studentId,
        teacherId,
      })),
      skipDuplicates: true,
    })

    // Add subject information to the email context
    const teacherName = teacher.user?.name || 'Teacher'
    const teacherEmail = teacher.user?.email || ''

    // Get student names and their enrolled subjects
    const studentData = students.map((student) => {
      const enrolledSubjects = student.StudentsOnSubjects.map(
        (enrollment) => enrollment.subject.name
      ).join(', ')

      // Find matching subjects between teacher and student
      const matchingSubjects = student.StudentsOnSubjects.filter((enrollment) =>
        teachableSubjects.some((teachable) =>
          enrollment.subject.name
            .toLowerCase()
            .includes(teachable.toLowerCase())
        )
      )
        .map((enrollment) => enrollment.subject.name)
        .join(', ')

      return {
        name: student.user?.name || 'Student',
        email: student.user?.email,
        subjects: enrolledSubjects,
        matchingSubjects: matchingSubjects || 'None',
      }
    })

    const studentNames = studentData.map((s) => s.name)

    // Send email notification to the teacher
    if (teacherEmail) {
      await sendTeacherAssignmentEmail(
        teacherEmail,
        teacherName,
        studentNames,
        teachableSubjects.join(', ')
      )
    }

    // Send email notifications to each student
    for (const student of studentData) {
      if (student.email) {
        await sendStudentAssignmentEmail(
          student.email,
          student.name,
          teacherName,
          teacherEmail,
          student.matchingSubjects
        )
      }
    }

    revalidatePath('/admin/teachers')
    return { success: true, count: results.count }
  } catch (error) {
    console.error('Error assigning students to teacher:', error)
    return { error: 'Failed to assign students to teacher' }
  }
}

export async function getUnassignedStudents(teacherId: number) {
  try {
    // First, get the teacher and their teachable subjects
    const teacher = await db.teacher.findUnique({
      where: { id: teacherId },
      include: {
        user: true,
        teacherApplication: {
          select: {
            teachableSubjects: true,
          },
        },
      },
    })

    if (!teacher || !teacher.teacherApplication) {
      return { error: 'Teacher not found or application not available' }
    }

    // Parse the teachable subjects
    const teachableSubjects = teacher.teacherApplication.teachableSubjects
      .split(',')
      .map((subject: string) => subject.trim().toLowerCase())

    // Get students not assigned to this teacher
    const students = await db.student.findMany({
      where: {
        NOT: {
          teachers: {
            some: {
              teacherId: teacherId,
            },
          },
        },
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        StudentsOnSubjects: {
          include: {
            subject: true,
          },
        },
      },
    })

    // Filter and format students with their enrolled subjects
    const studentsWithSubjects = students.map((student) => {
      const enrolledSubjects = student.StudentsOnSubjects.map((enrollment) => ({
        id: enrollment.subjectId,
        name: enrollment.subject.name,
      }))

      // Check if the student is enrolled in at least one subject the teacher can teach
      const matchingSubjects = enrolledSubjects.filter((subject) =>
        teachableSubjects.some((teachable: string) =>
          subject.name.toLowerCase().includes(teachable)
        )
      )

      return {
        id: student.id,
        user: student.user,
        enrolledSubjects,
        matchingSubjects,
        isMatch: matchingSubjects.length > 0,
      }
    })

    // Sort students: first those with matching subjects, then others
    const sortedStudents = studentsWithSubjects.sort((a, b) => {
      if (a.isMatch && !b.isMatch) return -1
      if (!a.isMatch && b.isMatch) return 1
      return 0
    })

    return { students: sortedStudents }
  } catch (error) {
    console.error('Error fetching unassigned students:', error)
    return { error: 'Failed to fetch unassigned students' }
  }
}

export async function getTeacherStudents(userId: string) {
  try {
    console.log('Finding teacher for userId:', userId)

    // First get the teacher record using the userId
    const teacher = await db.teacher.findUnique({
      where: { userId },
    })

    if (!teacher) {
      console.log('Teacher not found for userId:', userId)
      return { error: 'Teacher not found' }
    }

    console.log('Found teacher with ID:', teacher.id)

    const students = await db.studentsOnTeachers.findMany({
      where: { teacherId: teacher.id },
      include: {
        student: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
            StudentsOnSubjects: {
              include: {
                subject: true,
              },
            },
          },
        },
      },
    })

    if (!students.length) {
      return { students: [] }
    }

    const formattedStudents = students.map(({ student, assignedAt }) => {
      // Extract subjects from StudentsOnSubjects
      const subjects =
        student.StudentsOnSubjects?.map(
          (enrollment) => enrollment.subject.name
        ) || []

      return {
        id: student.id,
        name: student.user.name,
        email: student.user.email,
        assignedAt,
        subjects,
      }
    })

    console.log('Formatted students:', formattedStudents)
    return { students: formattedStudents }
  } catch (error) {
    console.error('Error fetching teacher students:', error)
    return { error: 'Failed to fetch students' }
  }
}

export async function getStudentTeachers(studentId: string) {
  try {
    console.log('Fetching teachers for student:', studentId)

    // First verify if the student exists
    const student = await db.student.findUnique({
      where: { userId: studentId },
    })

    if (!student) {
      console.log('Student not found:', studentId)
      return { error: 'Student not found' }
    }

    const teacherAssignments = await db.studentsOnTeachers.findMany({
      where: { studentId: student.id },
      include: {
        teacher: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
            teacherApplication: {
              select: {
                yearsOfExperience: true,
                preferredAgeGroup: true,
              },
            },
          },
        },
      },
    })

    // console.log(
    //   'Found teacher assignments:',
    //   JSON.stringify(teacherAssignments, null, 2)
    // )

    if (!teacherAssignments.length) {
      console.log('No teachers found for student:', studentId)
      return { teachers: [] }
    }

    const formattedTeachers = teacherAssignments.map(
      ({ teacher, assignedAt }) => ({
        id: teacher.id,
        name: teacher.user.name,
        email: teacher.user.email,
        experience: teacher.teacherApplication?.yearsOfExperience,
        ageGroup: teacher.teacherApplication?.preferredAgeGroup,
        assignedAt,
      })
    )

    // console.log(
    //   'Formatted teachers:',
    //   JSON.stringify(formattedTeachers, null, 2)
    // )
    return { teachers: formattedTeachers }
  } catch (error) {
    console.error('Error fetching student teachers:', error)
    return { error: 'Failed to fetch teachers' }
  }
}

// Get teacher's schedule
export async function getTeacherSchedule(userId: string) {
  try {
    const teacher = await db.teacher.findUnique({
      where: { userId },
      select: {
        id: true,
        userId: true,
        user: { select: { name: true, email: true } },
      },
    })

    if (!teacher) {
      return { error: 'Teacher not found', schedules: [] }
    }

    const schedules = await db.schedule.findMany({
      where: {
        teacherId: teacher.userId,
      },
      include: {
        student: {
          select: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        subject: {
          select: {
            name: true,
          },
        },
      },
    })

    return {
      schedules: schedules.map((schedule) => ({
        id: schedule.id,
        title: `${schedule.title} - ${
          schedule.student.user.name || schedule.student.user.email
        }`,
        start: schedule.startTime,
        end: schedule.endTime,
        studentId: schedule.studentId,
        subjectId: schedule.subjectId,
        studentName: schedule.student.user.name || schedule.student.user.email,
        subjectName: schedule.subject.name,

        teacherId: teacher.userId,
        teacherName: teacher.user.name || teacher.user.email,
        // teacherEmail: teacher.user.email,
      })),
    }
  } catch (error) {
    console.error('Error in getTeacherSchedule:', error)
    return { error: 'Failed to fetch schedules', schedules: [] }
  }
}

// Unified function to create or update a schedule
export async function upsertSchedule({
  scheduleId,
  teacherId,
  studentId,
  subjectId,
  startTime,
  endTime,
  title = 'Class Session',
}: {
  scheduleId?: number
  teacherId: string
  studentId?: string
  subjectId?: number
  startTime: Date
  endTime: Date
  title?: string
}) {
  try {
    // Check for time slot conflicts, excluding the current schedule if updating
    const existingSchedule = await db.schedule.findFirst({
      where: {
        teacherId,
        ...(scheduleId && { id: { not: scheduleId } }), // Exclude current schedule if updating
        OR: [
          {
            startTime: { lt: endTime },
            endTime: { gt: startTime },
          },
        ],
      },
    })

    if (existingSchedule) {
      return {
        error: scheduleId
          ? 'This time slot conflicts with another schedule. Please choose a different time.'
          : 'This time slot is already taken. Please choose a different time.',
      }
    }

    // If updating, verify the schedule exists and belongs to the teacher
    if (scheduleId) {
      const existingSchedule = await db.schedule.findFirst({
        where: {
          id: scheduleId,
          teacherId,
        },
      })

      if (!existingSchedule) {
        return { error: 'Schedule not found or unauthorized' }
      }
    }

    // Get teacher details
    const teacher = await db.user.findUnique({
      where: { id: teacherId },
      select: { name: true, email: true },
    })

    if (!teacher) {
      return { error: 'Teacher not found' }
    }

    // Get student details
    let student
    if (studentId) {
      const studentRecord = await db.student.findUnique({
        where: { id: studentId },
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      })

      if (studentRecord) {
        student = studentRecord.user
      }
    }

    // Get subject details
    let subjectName = title
    if (subjectId) {
      const subject = await db.subject.findUnique({
        where: { id: subjectId },
        select: { name: true },
      })

      if (subject) {
        subjectName = subject.name
      }
    }

    // Determine if this is a new schedule or an update
    const isNewSchedule = !scheduleId

    // Perform upsert operation
    const schedule = await db.schedule.upsert({
      where: {
        id: scheduleId || -1, // Use -1 for creation (will never match)
      },
      create: {
        teacherId,
        studentId: studentId!, // Required for creation
        subjectId: subjectId!, // Required for creation
        startTime,
        endTime,
        title,
      },
      update: {
        subjectId,
        startTime,
        endTime,
        title,
      },
      include: {
        student: {
          select: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        subject: {
          select: {
            name: true,
          },
        },
      },
    })

    // Send email notification for new schedules only
    if (isNewSchedule && student && student.email) {
      await sendClassScheduleEmail(
        student.email,
        student.name || 'Student',
        teacher.name || 'Teacher',
        title,
        subjectName,
        startTime,
        endTime
      )
    }

    // Revalidate paths to update UI
    revalidatePath('/teacher/schedule')
    revalidatePath('/student/schedule')

    return {
      schedule: {
        ...schedule,
        studentName: schedule.student.user.name || schedule.student.user.email,
        subjectName: schedule.subject.name,
      },
    }
  } catch (error) {
    console.error('Error in upsertSchedule:', error)
    return { error: 'Failed to save schedule' }
  }
}

// Delete a schedule (keeping this separate as it's a different operation)
export async function deleteSchedule(scheduleId: number, userId: string) {
  try {
    const teacher = await db.teacher.findUnique({
      where: { userId },
      select: { id: true, userId: true },
    })

    if (!teacher) {
      return { error: 'Teacher not found' }
    }

    // Check if schedule exists and belongs to teacher
    const existingSchedule = await db.schedule.findFirst({
      where: {
        id: scheduleId,
        teacherId: teacher.userId,
      },
    })

    if (!existingSchedule) {
      return { error: 'Schedule not found' }
    }

    await db.schedule.delete({
      where: { id: scheduleId },
    })

    return { success: true }
  } catch (error) {
    console.error('Error in deleteSchedule:', error)
    return { error: 'Failed to delete schedule' }
  }
}

// Get student's schedule
export async function getStudentSchedule(userId: string) {
  try {
    const student = await db.student.findUnique({
      where: { userId },
      select: { id: true, user: { select: { name: true, email: true } } },
    })

    if (!student) {
      return { error: 'Student not found', schedules: [] }
    }

    const schedules = await db.schedule.findMany({
      where: {
        studentId: student.id,
      },
      include: {
        teacher: {
          select: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        subject: {
          select: {
            name: true,
          },
        },
      },
    })

    return {
      schedules: schedules.map((schedule) => ({
        id: schedule.id,
        title: `${schedule.title} - ${
          schedule.teacher.user.name || schedule.teacher.user.email
        }`,
        start: schedule.startTime,
        end: schedule.endTime,
        teacherId: schedule.teacherId,
        subjectId: schedule.subjectId,
        studentId: schedule.studentId,
        studentName: student.user.name || student.user.email,
        teacherName: schedule.teacher.user.name || schedule.teacher.user.email,
        subjectName: schedule.subject.name,
      })),
    }
  } catch (error) {
    console.error('Error in getStudentSchedule:', error)
    return { error: 'Failed to fetch schedules', schedules: [] }
  }
}

export async function getAllSchedules() {
  try {
    const schedules = await db.schedule.findMany({
      include: {
        student: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        teacher: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        subject: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    })

    return {
      schedules: schedules.map((schedule) => ({
        id: schedule.id,
        title: schedule.title,
        start: schedule.startTime,
        end: schedule.endTime,
        studentId: schedule.studentId,
        teacherId: schedule.teacherId,
        subjectId: schedule.subjectId,
        studentName: schedule.student.user.name || 'Unnamed Student',
        teacherName: schedule.teacher.user.name || 'Unnamed Teacher',
        subjectName: schedule.subject.name,
      })),
    }
  } catch (error) {
    console.log('error', error)
    return { error: 'Failed to fetch schedules', schedules: [] }
  }
}

/**
 * Reassigns students from one teacher to another
 * This is useful when a teacher leaves or when we need to balance teacher workloads
 */
export async function reassignStudentsToTeacher(
  fromTeacherId: number,
  toTeacherId: number,
  studentIds: string[]
) {
  try {
    if (!fromTeacherId || !toTeacherId || !studentIds.length) {
      return {
        error:
          'Source teacher, target teacher, and at least one student ID are required',
      }
    }

    // Get details for the source and target teachers
    const sourceTeacherResult = await db.teacher.findUnique({
      where: { id: fromTeacherId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        teacherApplication: {
          select: {
            teachableSubjects: true,
          },
        },
      },
    })

    const targetTeacherResult = await db.teacher.findUnique({
      where: { id: toTeacherId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        teacherApplication: {
          select: {
            teachableSubjects: true,
          },
        },
      },
    })

    if (!sourceTeacherResult || !targetTeacherResult) {
      return { error: 'One or both teachers not found' }
    }

    const sourceTeacher = sourceTeacherResult
    const targetTeacher = targetTeacherResult

    // Get students with their subjects
    const students = await db.student.findMany({
      where: {
        id: {
          in: studentIds,
        },
        teachers: {
          some: {
            teacherId: fromTeacherId,
          },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        StudentsOnSubjects: {
          include: {
            subject: true,
          },
        },
      },
    })

    if (students.length === 0) {
      return { error: 'No valid students found for reassignment' }
    }

    // Start a transaction to perform all database operations
    // const results =
    await db.$transaction(async (tx) => {
      // 1. Remove relationships from the old teacher
      await tx.studentsOnTeachers.deleteMany({
        where: {
          teacherId: fromTeacherId,
          studentId: {
            in: studentIds,
          },
        },
      })

      // 2. Create relationships with the new teacher
      await tx.studentsOnTeachers.createMany({
        data: studentIds.map((studentId) => ({
          studentId,
          teacherId: toTeacherId,
        })),
        skipDuplicates: true,
      })

      // 3. Update any scheduled classes to point to the new teacher
      await tx.schedule.updateMany({
        where: {
          studentId: {
            in: studentIds,
          },
          teacherId: sourceTeacher.userId,
        },
        data: {
          teacherId: targetTeacher.userId,
        },
      })

      return { success: true, count: studentIds.length }
    })

    // Get teachable subjects
    // const sourceTeacherSubjects =
    // sourceTeacher.teacherApplication?.teachableSubjects || ''
    const targetTeacherSubjects =
      targetTeacher.teacherApplication?.teachableSubjects || ''

    // Get student data for notifications
    const studentData = students.map((student) => {
      const enrolledSubjects = student.StudentsOnSubjects.map(
        (enrollment) => enrollment.subject.name
      ).join(', ')

      // Find matching subjects with the target teacher
      const matchingSubjects = student.StudentsOnSubjects.filter((enrollment) =>
        targetTeacherSubjects
          .toLowerCase()
          .includes(enrollment.subject.name.toLowerCase())
      )
        .map((enrollment) => enrollment.subject.name)
        .join(', ')

      return {
        id: student.id,
        name: student.user?.name || 'Student',
        email: student.user?.email,
        subjects: enrolledSubjects,
        matchingSubjects: matchingSubjects || 'None',
      }
    })

    // Prepare data for email
    // const sourceTeacherName = sourceTeacher.user?.name || 'Previous Teacher'
    const targetTeacherName = targetTeacher.user?.name || 'New Teacher'
    const targetTeacherEmail = targetTeacher.user?.email || ''
    const studentNames = studentData.map((s) => s.name)

    // Send email notification to the target teacher
    if (targetTeacherEmail) {
      await sendTeacherAssignmentEmail(
        targetTeacherEmail,
        targetTeacherName,
        studentNames,
        targetTeacherSubjects
      )
    }

    // Send email notifications to each student
    for (const student of studentData) {
      if (student.email) {
        await sendStudentAssignmentEmail(
          student.email,
          student.name,
          targetTeacherName,
          targetTeacherEmail,
          student.matchingSubjects
        )
      }
    }

    revalidatePath('/admin/teachers')
    return { success: true, count: studentIds.length }
  } catch (error) {
    console.error('Error reassigning students:', error)
    return { error: 'Failed to reassign students' }
  }
}
