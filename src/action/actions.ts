'use server'
import db from '@/lib/db'
import { hash } from 'bcryptjs'
import { signIn } from '@/lib/auth'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

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
    const hashedPassword = await hashPassword(password)
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      },
    })
    return user
  } catch (error) {
    console.error(error)
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
    return { error: 'Failed to fetch application' }
  }
}

// Update application status
export async function updateApplicationStatus(
  id: number,
  status: 'APPROVED' | 'REJECTED'
) {
  try {
    const application = await db.teacherApplication.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date(),
      },
    })

    revalidatePath('/admin/applications')
    return { success: true, application }
  } catch (error) {
    return { error: 'Failed to update application status' }
  }
}
