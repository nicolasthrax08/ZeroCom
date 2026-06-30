import { NextResponse } from 'next/server';
import { currentUser } from '@/server/auth';

export async function GET() {
  const user = await currentUser();
  return NextResponse.json({
    ok: true,
    data: user
      ? {
          id: user.id,
          displayName: user.displayName,
          role: user.role,
          isShadowBanned: user.isShadowBanned,
          isHardBanned: user.isHardBanned,
        }
      : null,
  });
}
