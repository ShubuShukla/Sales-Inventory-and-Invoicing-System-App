// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function main() {
  const adminPhone = '9999999999';
  const adminPassword = 'admin123'; // change later if you want

  const existing = await prisma.user.findUnique({
    where: { phone: adminPhone },
  });

  if (!existing) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const admin = await prisma.user.create({
      data: {
        phone: adminPhone,
        name: 'SIISA Admin',
        role: 'ADMIN',
        password: hashedPassword,
        isVerified: true,
      },
    });

    console.log('✔ Admin user created successfully');
    console.log(`Phone: ${adminPhone}`);
    console.log(`Password: ${adminPassword}`);
  } else {
    console.log('ℹ Admin user already exists. Skipping seed.');
  }
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
