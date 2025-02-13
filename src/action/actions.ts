'use server'
import db from '@/lib/db'
import { hash } from 'bcryptjs'
import { signIn } from '@/lib/auth'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { ApplicationStatus } from '@prisma/client'

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

    return { success: true, user: result }
  } catch (error) {
    console.error('Error creating user:', error)
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
    // Use a transaction to update both models
    const result = await db.$transaction(async (tx) => {
      // First update the application
      const application = await tx.teacherApplication.update({
        where: { id },
        data: {
          status,
          updatedAt: new Date(),
        },
        include: {
          teacher: true,
        },
      })

      // Then update the teacher's status
      await tx.teacher.update({
        where: { id: application.teacherId },
        data: {
          status,
          // If approved, set the hire date
          ...(status === 'APPROVED' && {
            hireDate: new Date(),
          }),
        },
      })

      return application
    })

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
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return { teachers }
  } catch (error) {
    console.error('Error fetching teachers:', error)
    return { error: 'Failed to fetch teachers' }
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
    const result = await db.studentsOnTeachers.createMany({
      data: studentIds.map((studentId) => ({
        teacherId,
        studentId,
      })),
      skipDuplicates: true, // Skip if assignment already exists
    })

    revalidatePath('/admin/teachers')
    return { success: true, count: result.count }
  } catch (error) {
    console.error('Error assigning students to teacher:', error)
    return { error: 'Failed to assign students to teacher' }
  }
}

export async function getUnassignedStudents(teacherId: number) {
  try {
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
      },
    })
    return { students }
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
          },
        },
      },
    })

    if (!students.length) {
      return { students: [] }
    }

    const formattedStudents = students.map(({ student, assignedAt }) => ({
      id: student.id,
      name: student.user.name,
      email: student.user.email,
      assignedAt,
    }))

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
