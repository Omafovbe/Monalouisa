'use server'

import db from '@/lib/db'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { getSubscription } from './stripe-actions'

/**
 * Get all available subjects
 */
export async function getAllSubjects() {
  try {
    const subjects = await db.subject.findMany({
      orderBy: {
        name: 'asc',
      },
    })

    return { subjects }
  } catch (error) {
    console.error('Error fetching subjects:', error)
    return { error: 'Failed to fetch subjects' }
  }
}

/**
 * Enroll a student in a subject
 */
export async function enrollInSubject(subjectId: number, studentId: string) {
  try {
    const session = await auth()
    if (!session?.user) {
      return { error: 'Unauthorized' }
    }

    // Check if the student exists
    const student = await db.student.findUnique({
      where: { userId: studentId },
    })

    if (!student) {
      return { error: 'Student not found' }
    }

    // Check if the student has an active subscription
    const subscriptionData = await getSubscription(studentId)
    const hasActiveSubscription =
      subscriptionData?.status === 'HAS_SUBSCRIPTION' &&
      subscriptionData.subscription?.status === 'active'

    if (!hasActiveSubscription) {
      return { error: 'Active subscription required to enroll in subjects' }
    }

    // Check if the subject exists
    const subject = await db.subject.findUnique({
      where: { id: subjectId },
    })

    if (!subject) {
      return { error: 'Subject not found' }
    }

    // Check if the student is already enrolled in the subject
    const existingEnrollment = await db.studentsOnSubjects.findUnique({
      where: {
        studentId_subjectId: {
          studentId: student.id,
          subjectId,
        },
      },
    })

    if (existingEnrollment) {
      return { error: 'Student is already enrolled in this subject' }
    }

    // Create the enrollment
    const enrollment = await db.studentsOnSubjects.create({
      data: {
        studentId: student.id,
        subjectId,
      },
    })

    revalidatePath('/student/subjects')
    return { success: true, enrollment }
  } catch (error) {
    console.log('Error enrolling student in subject:', error)
    return { error: 'Failed to enroll student in subject' }
  }
}

/**
 * Unenroll a student from a subject
 */
export async function unenrollFromSubject(
  studentId: string,
  subjectId: number
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return { error: 'Unauthorized' }
    }

    // Check if the enrollment exists
    const existingEnrollment = await db.studentsOnSubjects.findUnique({
      where: {
        studentId_subjectId: {
          studentId,
          subjectId,
        },
      },
    })

    if (!existingEnrollment) {
      return { error: 'Student is not enrolled in this subject' }
    }

    // Delete the enrollment
    await db.studentsOnSubjects.delete({
      where: {
        studentId_subjectId: {
          studentId,
          subjectId,
        },
      },
    })

    revalidatePath('/student/subjects')
    return { success: true }
  } catch (error) {
    console.error('Error unenrolling student from subject:', error)
    return { error: 'Failed to unenroll student from subject' }
  }
}

/**
 * Get all subjects a student is enrolled in
 */
export async function getEnrolledSubjects(studentId: string) {
  try {
    const session = await auth()
    if (!session?.user) {
      return { error: 'Unauthorized' }
    }

    // Check if the student exists
    const student = await db.student.findUnique({
      where: { userId: studentId },
    })

    if (!student) {
      return { error: 'Student not found' }
    }

    // Get all subjects the student is enrolled in
    const enrollments = await db.studentsOnSubjects.findMany({
      where: { studentId: student.id },
      include: {
        subject: true,
      },
      orderBy: {
        enrolledAt: 'desc',
      },
    })

    // Get the teachers for each subject
    const subjectsWithTeachers = await Promise.all(
      enrollments.map(async (enrollment) => {
        // Find teachers who teach this subject
        const subjectTeachers = await db.subjectsOnTeachers.findMany({
          where: { subjectId: enrollment.subjectId },
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
          take: 1, // Just get the first teacher for simplicity
        })

        // Find the next scheduled class for this subject and student
        const nextClass = await db.schedule.findFirst({
          where: {
            studentId,
            subjectId: enrollment.subjectId,
            startTime: {
              gt: new Date(),
            },
          },
          orderBy: {
            startTime: 'asc',
          },
          select: {
            startTime: true,
            endTime: true,
          },
        })

        return {
          id: enrollment.subject.id,
          name: enrollment.subject.name,
          description: enrollment.subject.description,
          enrolledAt: enrollment.enrolledAt,
          teachers: subjectTeachers.map((st) => ({
            id: st.teacher.id,
            name: st.teacher.user.name || st.teacher.user.email,
          })),
          nextClass: nextClass
            ? {
                startTime: nextClass.startTime,
                endTime: nextClass.endTime,
              }
            : null,
        }
      })
    )

    return { subjects: subjectsWithTeachers }
  } catch (error) {
    console.error('Error fetching student subjects:', error)
    return { error: 'Failed to fetch student subjects' }
  }
}

/**
 * Get IDs of subjects a student is enrolled in
 */
export async function getEnrolledSubjectIds(
  studentId: string
): Promise<number[]> {
  try {
    const session = await auth()
    if (!session?.user) {
      console.error('Unauthorized access to getEnrolledSubjectIds')
      return []
    }

    const enrollments = await db.studentsOnSubjects.findMany({
      where: { studentId },
      select: {
        subjectId: true,
      },
    })

    return enrollments.map((enrollment) => enrollment.subjectId)
  } catch (error) {
    console.error('Error fetching enrolled subject IDs:', error)
    return []
  }
}

/**
 * Get detailed information about a specific subject
 */
export async function getSubjectDetails(subjectId: number, studentId: string) {
  try {
    const session = await auth()
    if (!session?.user) {
      return { error: 'Unauthorized' }
    }

    // Check if the subject exists
    const subject = await db.subject.findUnique({
      where: { id: subjectId },
    })

    if (!subject) {
      return { error: 'Subject not found' }
    }

    // Check if the student is enrolled in the subject
    const enrollment = await db.studentsOnSubjects.findUnique({
      where: {
        studentId_subjectId: {
          studentId,
          subjectId,
        },
      },
    })

    if (!enrollment) {
      return { error: 'Student is not enrolled in this subject' }
    }

    // Get teachers for this subject
    const subjectTeachers = await db.subjectsOnTeachers.findMany({
      where: { subjectId },
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
    })

    // Get upcoming classes for this subject and student
    const upcomingClasses = await db.schedule.findMany({
      where: {
        subjectId,
        studentId,
        startTime: {
          gt: new Date(),
        },
      },
      orderBy: {
        startTime: 'asc',
      },
      take: 5,
    })

    // Count total students enrolled in this subject
    const studentCount = await db.studentsOnSubjects.count({
      where: { subjectId },
    })

    // Mock data for materials and discussions (would be replaced with actual DB queries)
    const materials = [
      {
        id: 1,
        title: 'Introduction to the Subject',
        type: 'PDF',
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        title: 'Week 1 Lecture Notes',
        type: 'PDF',
        createdAt: new Date().toISOString(),
      },
      {
        id: 3,
        title: 'Practice Exercises',
        type: 'DOCX',
        createdAt: new Date().toISOString(),
      },
    ]

    const discussions = [
      {
        id: 1,
        title: 'Week 1 Discussion',
        messageCount: 12,
        lastMessage: 'Great point about the assignment!',
        updatedAt: new Date().toISOString(),
      },
      {
        id: 2,
        title: 'Questions about the midterm',
        messageCount: 8,
        lastMessage: 'Will the exam cover chapter 5?',
        updatedAt: new Date().toISOString(),
      },
    ]

    // Mock progress data (would be replaced with actual DB queries)
    const progress = {
      attendance: 85,
      assignments: 70,
      overall: 78,
    }

    // Construct the response
    const subjectDetails = {
      id: subject.id,
      name: subject.name,
      description: subject.description,
      enrolledAt: enrollment.enrolledAt,
      teachers: subjectTeachers.map((st) => ({
        id: st.teacher.id,
        name: st.teacher.user.name || st.teacher.user.email,
        profilePicture: null, // Would come from the teacher profile
        bio: 'Experienced teacher specializing in this subject.', // Would come from the teacher profile
      })),
      upcomingClasses,
      classCount: upcomingClasses.length, // This would be a more comprehensive count in a real app
      studentCount,
      materialCount: materials.length,
      materials,
      discussions,
      progress,
    }

    return { subject: subjectDetails }
  } catch (error) {
    console.error('Error fetching subject details:', error)
    return { error: 'Failed to fetch subject details' }
  }
}
