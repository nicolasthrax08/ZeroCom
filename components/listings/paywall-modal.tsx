'use client';
import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { FREE_VIEWS_PER_DAY, FREE_MESSAGES_PER_DAY, FREE_SAVED_LIMIT } from '@/lib/constants';

const plans = [
  {
    key: 'FREE',
    name: '免费',
    price: '¥0',
    cadence: '永不扣费',
    highlight: false,
    features: [
      `每日 ${FREE_VIEWS_PER_DAY} 个房源详情`,
      `每日 ${FREE_MESSAGES_PER_DAY} 条消息`,
      `最多 ${FREE_SAVED_LIMIT} 个收藏`,
      '联系方式隐藏',
      '基础筛选',
    ],
  },
  {
    key: 'MONTHLY_PRO',
    name: '月度 Pro',
    price: '¥29',
    cadence: '/30 天 · 可随时取消',
    highlight: true,
    features: [
      '无限浏览房源',
      '无限消息 · 无限收藏',
      '直接联系卖家（电话/微信）',
      '高级筛选（学区、地铁距离）',
      '每日精选房源邮件',
      '房源排序额外加权',
      'Verified Owner 标签',
    ],
  },
  {
    key: 'ANNUAL_PRO',
    name: '年度 Pro',
    price: '¥199',
    cadence: '/365 天 · 自动续期',
    highlight: false,
    features: [
      '月度 Pro 全部权益',
      '实时推送匹配',
      '房源排序最高优先级',
      '42% 折扣（相比月度）',
      '价格趋势图',
    ],
  },
];

export function PaywallModal({
  open,
  onClose,
  title = '解锁 ZeroCom Pro',
  description = '无限浏览房源 · 直接联系卖家',
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}) {
  const [plan, setPlan] = useState('MONTHLY_PRO');
  return (
    <Modal open={open} onClose={onClose} title={title} description={description} size="lg">
      <div className="grid gap-3 md:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.key}
            className={`relative rounded-xl border p-4 ${
              p.highlight ? 'border-accent ring-2 ring-accent/20' : 'border-border'
            }`}
          >
            {p.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 text-xs text-white">
                推荐
              </span>
            )}
            <h4 className="text-sm font-semibold text-foreground">{p.name}</h4>
            <p className="mt-2">
              <span className="text-3xl font-bold text-foreground">{p.price}</span>
              <span className="ml-1 text-xs text-muted-foreground">{p.cadence}</span>
            </p>
            <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-1">
                  <Check size={14} className="mt-0.5 text-accent" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href={{ pathname: '/checkout', query: { plan: p.key } }}
              onClick={onClose}
              className="block"
            >
              <Button variant={p.highlight ? 'accent' : 'outline'} className="mt-3 w-full">
                {p.key === 'FREE' ? '当前方案' : '选择方案'}
              </Button>
            </Link>
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        ZeroCom 仅收取订阅费，永远不收交易佣金。订阅后 30 天内可无理由退款。
      </p>
    </Modal>
  );
}
