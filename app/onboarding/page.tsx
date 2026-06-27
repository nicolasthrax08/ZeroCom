import Link from 'next/link';
import { Card, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, ListChecks, FileText } from 'lucide-react';

export default function OnboardingPage() {
  return (
    <main className="container-page py-12">
      <div className="mx-auto max-w-2xl space-y-4">
        <Card>
          <CardBody>
            <h1 className="text-xl font-semibold text-foreground">欢迎入住 ZeroCom</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              为保障交易真实、透明，所有用户需完成以下步骤：
            </p>
            <ul className="mt-4 space-y-3">
              <Step
                icon={<ShieldCheck size={20} />}
                title="手机号已验证"
                desc="已完成。您将以此手机号登录并接收通知。"
                done
              />
              <Step
                icon={<ListChecks size={20} />}
                title="实名认证（仅卖家）"
                desc="若你需要发布房源，需完成真实姓名 + 身份证 OCR 核验。"
              />
              <Step
                icon={<FileText size={20} />}
                title="阅读并同意政策"
                desc="请阅读《服务条款》《隐私政策》《退款政策》。"
              />
            </ul>
            <div className="mt-4 rounded-lg border border-border bg-muted p-3 text-xs text-muted-foreground">
              <p className="font-medium text-background">反中介说明</p>
              <p>
                ZeroCom 严禁中介以个人名义注册、爬取房源、倒卖联系方式。一经系统识别或用户举报，将封并清理房源。
              </p>
            </div>
            <div className="mt-5 flex gap-2">
              <Link href="/listings" className="flex-1">
                <Button variant="accent" className="w-full">开始浏览</Button>
              </Link>
              <Link href="/seller/verification" className="flex-1">
                <Button variant="outline" className="w-full">我是卖家 · 认证</Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </main>
  );
}

function Step({
  icon,
  title,
  desc,
  done,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  done?: boolean;
}) {
  return (
    <li className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
        {icon}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-foreground">{title}</p>
          {done && <Badge tone="success">已完成</Badge>}
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
      </div>
    </li>
  );
}
