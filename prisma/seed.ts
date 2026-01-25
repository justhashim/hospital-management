import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create users
  await prisma.user.upsert({
    where: { email: 'admin@hospital.com' },
    update: {},
    create: {
      email: 'admin@hospital.com',
      password: await bcrypt.hash('AdminPass123!', 12),
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  });

  const doctorUser = await prisma.user.upsert({
    where: { email: 'doctor@hospital.com' },
    update: {},
    create: {
      email: 'doctor@hospital.com',
      password: await bcrypt.hash('DoctorPass123!', 12),
      firstName: 'Dr. Sarah',
      lastName: 'Johnson',
      role: 'DOCTOR',
    },
  });

  const regularUser = await prisma.user.upsert({
    where: { email: 'user@hospital.com' },
    update: {},
    create: {
      email: 'user@hospital.com',
      password: await bcrypt.hash('UserPass123!', 12),
      firstName: 'John',
      lastName: 'Smith',
      role: 'USER',
    },
  });

  // Create patients
  const patients = [
    {
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice.johnson@email.com',
      phone: '1234567890',
      dateOfBirth: new Date('1990-05-15'),
      gender: 'FEMALE' as const,
      address: '123 Main St',
      city: 'Boston',
      state: 'MA',
      zipCode: '02101',
      bloodGroup: 'A_POSITIVE' as const,
      allergies: 'Penicillin',
      medicalHistory: 'No major illnesses',
      emergencyContactName: 'Bob Johnson',
      emergencyContactPhone: '9876543210',
      createdById: doctorUser.id,
    },
    {
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'michael.brown@email.com',
      phone: '2345678901',
      dateOfBirth: new Date('1985-08-22'),
      gender: 'MALE' as const,
      address: '456 Oak Ave',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      bloodGroup: 'B_POSITIVE' as const,
      allergies: 'None',
      medicalHistory: 'Diabetes Type 2',
      emergencyContactName: 'Sarah Brown',
      emergencyContactPhone: '8765432109',
      createdById: regularUser.id,
    },
    {
      firstName: 'Emily',
      lastName: 'Davis',
      email: 'emily.davis@email.com',
      phone: '3456789012',
      dateOfBirth: new Date('1992-12-03'),
      gender: 'FEMALE' as const,
      address: '789 Pine St',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      bloodGroup: 'O_NEGATIVE' as const,
      allergies: 'Latex, Sulfa drugs',
      medicalHistory: 'Asthma',
      emergencyContactName: 'David Davis',
      emergencyContactPhone: '7654321098',
      createdById: doctorUser.id,
    },
  ];

  for (const patientData of patients) {
    await prisma.patient.upsert({
      where: { email: patientData.email },
      update: {},
      create: patientData,
    });
  }

  console.log('✅ Database seeding completed successfully!');
  console.log(`👤 Created ${3} users`);
  console.log(`🏥 Created ${patients.length} patients`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });