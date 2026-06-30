// Prisma seed script — populates the database with demo data.
// Run with: npm run db:seed

import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create demo users
  const users = [
    { id: 'user-free-buyer', phoneHash: 'hash-13800000001', phoneEncrypted: 'enc-dev-13800000001', displayName: '张伟 (免费用户)', role: UserRole.USER },
    { id: 'user-monthly-buyer', phoneHash: 'hash-13800000002', phoneEncrypted: 'enc-dev-13800000002', displayName: '李娜 (月度会员)', role: UserRole.USER },
    { id: 'user-annual-buyer', phoneHash: 'hash-13800000003', phoneEncrypted: 'enc-dev-13800000003', displayName: '王芳 (年度会员)', role: UserRole.USER },
    { id: 'user-tier2-seller', phoneHash: 'hash-13800000004', phoneEncrypted: 'enc-dev-13800000004', displayName: '陈刚 (认证卖家)', role: UserRole.USER },
    { id: 'user-shadow-banned', phoneHash: 'hash-13800000005', phoneEncrypted: 'enc-dev-13800000005', displayName: '刘某 (被shadow-ban卖家)', role: UserRole.USER, isShadowBanned: true },
    { id: 'user-admin', phoneHash: 'hash-13800000006', phoneEncrypted: 'enc-dev-13800000006', displayName: 'Admin', role: UserRole.ADMIN },
    { id: 'user-moderator', phoneHash: 'hash-13800000007', phoneEncrypted: 'enc-dev-13800000007', displayName: 'Moderator', role: UserRole.MODERATOR },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { id: u.id },
      update: {},
      create: {
        ...u,
        termsAcceptedAt: new Date('2026-06-01'),
        privacyAcceptedAt: new Date('2026-06-01'),
      },
    });
  }

  // Create verification for tier2 seller
  await prisma.userVerification.upsert({
    where: { userId: 'user-tier2-seller' },
    update: {},
    create: {
      userId: 'user-tier2-seller',
      status: 'ID_VERIFIED',
      realNameHash: 'realname-hash-seed-1',
      idCardHash: 'id-card-hash-seed-1',
      idCardFrontUrl: '/placeholder-id-card.svg',
      ocrProvider: 'mock',
      reviewedAt: new Date('2026-06-05'),
    },
  });

  // Create subscriptions
  await prisma.subscription.upsert({
    where: { id: 'sub-monthly-1' },
    update: {},
    create: {
      id: 'sub-monthly-1',
      userId: 'user-monthly-buyer',
      planCode: 'MONTHLY_PRO',
      status: 'ACTIVE',
      startsAt: new Date('2026-06-15'),
      endsAt: new Date('2026-07-15'),
      autoRenew: false,
    },
  });

  await prisma.subscription.upsert({
    where: { id: 'sub-annual-1' },
    update: {},
    create: {
      id: 'sub-annual-1',
      userId: 'user-annual-buyer',
      planCode: 'ANNUAL_PRO',
      status: 'ACTIVE',
      startsAt: new Date('2026-06-01'),
      endsAt: new Date('2027-06-01'),
      autoRenew: true,
    },
  });

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
