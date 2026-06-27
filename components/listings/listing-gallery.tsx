'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ListingPhoto } from '@/server/data/types';

export function ListingGallery({ photos }: { photos: ListingPhoto[] }) {
  const [idx, setIdx] = useState(0);
  if (!photos.length) {
    return (
      <div className="flex aspect-[16/10] w-full items-center justify-center rounded-xl bg-muted text-muted-foreground">
        暂无照片
      </div>
    );
  }
  const current = photos[idx];
  return (
    <div className="relative overflow-hidden rounded-xl bg-muted">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img key={current.url} src={current.url} alt={`房源图片 ${idx + 1}`} className="aspect-[16/10] w-full object-cover" />
      <div className="absolute bottom-3 right-3 rounded-md bg-black/60 px-2 py-0.5 text-xs text-white">
        {idx + 1} / {photos.length}
      </div>
      {photos.length > 1 && (
        <>
          <button
            onClick={() => setIdx((i) => (i - 1 + photos.length) % photos.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black"
            aria-label="上一张"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setIdx((i) => (i + 1) % photos.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black"
            aria-label="下一张"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}
    </div>
  );
}
