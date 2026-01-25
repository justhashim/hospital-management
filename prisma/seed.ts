import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/password';

const prisma = new PrismaClient();

/**
 * Database Seed Script
 * 
 * Seeds the database with initial data for testing and development.
 * Run with: pnpm prisma:seed
 */

async function main() {
    console.log('🌱 Starting database seed...');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await prisma.refreshToken.deleteMany();
    await prisma.patient.deleteMany();
    await prisma.user.deleteMany();

    // Create admin user
    console.log('👤 Creating admin user...');
    const adminPassword = await hashPassword('AdminPass123!');
    const admin = await prisma.user.create({
        data: {
            email: 'admin@hospital.com',
            password: adminPassword,
            firstName: 'Admin',
            lastName: 'User',
            role: 'ADMIN',
        },
    });
    console.log(`✅ Admin created: ${admin.email}`);

    // Create doctor user
    console.log('👨‍⚕️ Creating doctor user...');
    const doctorPassword = await hashPassword('DoctorPass123!');
    const doctor = await prisma.user.create({
        data: {
            email: 'doctor@hospital.com',
            password: doctorPassword,
            firstName: 'Dr. Sarah',
            lastName: 'Johnson',
            role: 'DOCTOR',
        },
    });
    console.log(`✅ Doctor created: ${doctor.email}`);

    // Create regular user
    console.log('👤 Creating regular user...');
    const userPassword = await hashPassword('UserPass123!');
    const user = await prisma.user.create({
        data: {
            email: 'user@hospital.com',
            password: userPassword,
            firstName: 'John',
            lastName: 'Staff',
            role: 'USER',
        },
    });
    console.log(`✅ User created: ${user.email}`);

    // Create sample patients
    console.log('🏥 Creating sample patients...');

    const patients = [
        {
            firstName: 'Emily',
            lastName: 'Davis',
            email: 'emily.davis@patient.com',
            phone: '5551234567',
            dateOfBirth: new Date('1985-03-15'),
            gender: 'FEMALE' as const,
            address: '123 Main Street',
            city: 'Boston',
            state: 'MA',
            zipCode: '02101',
            bloodGroup: 'A_POSITIVE' as const,
            allergies: 'Penicillin',
            medicalHistory: 'No major illnesses',
            emergencyContactName: 'Michael Davis',
            emergencyContactPhone: '5559876543',
            createdById: admin.id,
        },
        {
            firstName: 'Robert',
            lastName: 'Wilson',
            email: 'robert.wilson@patient.com',
            phone: '5552345678',
            dateOfBirth: new Date('1978-07-22'),
            gender: 'MALE' as const,
            address: '456 Oak Avenue',
            city: 'Chicago',
            state: 'IL',
            zipCode: '60601',
            bloodGroup: 'B_POSITIVE' as const,
            allergies: null,
            medicalHistory: 'Type 2 Diabetes, Hypertension',
            emergencyContactName: 'Lisa Wilson',
            emergencyContactPhone: '5558765432',
            createdById: doctor.id,
        },
        {
            firstName: 'Maria',
            lastName: 'Garcia',
            email: 'maria.garcia@patient.com',
            phone: '5553456789',
            dateOfBirth: new Date('1990-11-30'),
            gender: 'FEMALE' as const,
            address: '789 Elm Street',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90001',
            bloodGroup: 'O_NEGATIVE' as const,
            allergies: 'Latex, Shellfish',
            medicalHistory: 'Asthma',
            emergencyContactName: 'Carlos Garcia',
            emergencyContactPhone: '5557654321',
            createdById: doctor.id,
        },
        {
            firstName: 'James',
            lastName: 'Brown',
            email: null,
            phone: '5554567890',
            dateOfBirth: new Date('1995-05-10'),
            gender: 'MALE' as const,
            address: '321 Pine Road',
            city: 'Houston',
            state: 'TX',
            zipCode: '77001',
            bloodGroup: 'AB_POSITIVE' as const,
            allergies: null,
            medicalHistory: 'Healthy, no known conditions',
            emergencyContactName: 'Sarah Brown',
            emergencyContactPhone: '5556543210',
            createdById: user.id,
        },
        {
            firstName: 'Jennifer',
            lastName: 'Martinez',
            email: 'jennifer.martinez@patient.com',
            phone: '5555678901',
            dateOfBirth: new Date('1982-09-18'),
            gender: 'FEMALE' as const,
            address: '654 Maple Drive',
            city: 'Phoenix',
            state: 'AZ',
            zipCode: '85001',
            bloodGroup: 'A_NEGATIVE' as const,
            allergies: 'Sulfa drugs',
            medicalHistory: 'Migraine disorder, Anxiety',
            emergencyContactName: 'David Martinez',
            emergencyContactPhone: '5555432109',
            createdById: admin.id,
        },
    ];

    for (const patientData of patients) {
        const patient = await prisma.patient.create({
            data: patientData,
        });
        console.log(`✅ Patient created: ${patient.firstName} ${patient.lastName}`);
    }

    console.log('\n✨ Database seed completed successfully!\n');
    console.log('📋 Summary:');
    console.log(`   - ${await prisma.user.count()} users created`);
    console.log(`   - ${await prisma.patient.count()} patients created\n`);
    console.log('🔑 Login Credentials:');
    console.log('   Admin:  admin@hospital.com / AdminPass123!');
    console.log('   Doctor: doctor@hospital.com / DoctorPass123!');
    console.log('   User:   user@hospital.com / UserPass123!\n');
}

main()
    .catch((error) => {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
