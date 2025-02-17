'use server'

import db from '@/lib/db'
import {
  createAdminSchema,
  updateAdminSchema,
  changePasswordSchema,
} from '@/lib/validate'
import { hash } from 'bcryptjs'
import { z } from 'zod'

// Get all admin users
export async function getAdmins() {
  try {
    const admins = await db.user.findMany({
      where: {
        role: 'ADMIN',
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        admin: true,
      },
    })
    console.log('admins', admins)
    return { admins }
  } catch (error) {
    return { error: 'Failed to fetch admin users' }
  }
}

// Get a single admin by ID
export async function getAdminById(id: string) {
  try {
    const admin = await db.user.findFirst({
      where: {
        id,
        role: 'ADMIN',
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        admin: true,
      },
    })
    return { admin }
  } catch (error) {
    return { error: 'Failed to fetch admin user' }
  }
}

// Create a new admin user
export async function createAdmin(data: z.infer<typeof createAdminSchema>) {
  try {
    const existingUser = await db.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      return { error: 'Email already exists' }
    }

    const hashedPassword = await hash(data.password, 10)

    const user = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: 'ADMIN',
        admin: {
          create: {},
        },
      },
    })

    return { success: 'Admin created successfully', userId: user.id }
  } catch (error) {
    return { error: 'Failed to create admin user' }
  }
}

// Update admin profile
export async function updateAdmin(
  id: string,
  data: z.infer<typeof updateAdminSchema>
) {
  try {
    const existingUser = await db.user.findUnique({
      where: { id },
    })

    if (!existingUser) {
      return { error: 'Admin not found' }
    }

    if (data.email !== existingUser.email) {
      const emailExists = await db.user.findUnique({
        where: { email: data.email },
      })

      if (emailExists) {
        return { error: 'Email already exists' }
      }
    }

    await db.user.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
      },
    })

    return { success: 'Admin updated successfully' }
  } catch (error) {
    return { error: 'Failed to update admin user' }
  }
}

// Change admin password
export async function changeAdminPassword(
  id: string,
  data: z.infer<typeof changePasswordSchema>
) {
  try {
    const user = await db.user.findUnique({
      where: { id },
    })

    if (!user) {
      return { error: 'Admin not found' }
    }

    const hashedPassword = await hash(data.newPassword, 10)

    await db.user.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
    })

    return { success: 'Password changed successfully' }
  } catch (error) {
    return { error: 'Failed to change password' }
  }
}

// Delete admin user
export async function deleteAdmin(id: string) {
  try {
    await db.user.delete({
      where: { id },
    })

    return { success: 'Admin deleted successfully' }
  } catch (error) {
    return { error: 'Failed to delete admin user' }
  }
}
