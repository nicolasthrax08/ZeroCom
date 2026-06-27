import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/sidebar';
import { requireAdmin } from '@/server/auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="flex min-h-[80vh]">
      <AdminSidebar current="" />
      <div className="flex-1">{children}</div>
    </div>
  );
}
