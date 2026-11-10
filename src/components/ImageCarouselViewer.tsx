import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

// Thumbnail strip + full-screen viewer. In the viewer you can move between images (arrows, keyboard,
// swipe, thumbnails) without closing it.
export default function ImageCarouselViewer({ images }: { images: string[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);
  const count = images.length;
  const go = (step: number) => setIndex((i) => (i === null ? i : (i + step + count) % count));

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Escape") setIndex(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden"; // no page scroll behind the viewer
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index === null, count]);

  const arrow = "absolute top-1/2 -translate-y-1/2 rounded-full bg-white/15 hover:bg-white/30 text-white p-2 sm:p-3 transition";

  return (
    <>
      {/* Carousel section */}
      <div className="w-full max-w-md overflow-x-auto flex gap-4 rounded-lg p-2 border border-gray-300 shadow-inner scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`screenshot ${i + 1}`}
            className="h-56 w-auto object-cover rounded-lg shadow-md flex-shrink-0 transition-transform duration-300 hover:scale-105 border border-gray-300 cursor-pointer"
            onClick={() => setIndex(i)}
          />
        ))}
      </div>

      {/* Full-screen viewer */}
      {index !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Screenshot ${index + 1} of ${count}`}
          className="fixed inset-0 z-50 bg-black/85 flex flex-col items-center justify-center p-4"
          onClick={() => setIndex(null)}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          <button aria-label="Close" className="absolute top-4 right-4 rounded-full bg-white/15 hover:bg-white/30 text-white p-2"
            onClick={() => setIndex(null)}>
            <X className="h-6 w-6" />
          </button>

          <div className="relative flex items-center justify-center w-full flex-1 min-h-0" >
            <img
              src={images[index]}
              alt={`Screenshot ${index + 1}`}
              className="max-h-[75vh] max-w-[90vw] object-contain rounded shadow-lg select-none"
              onClick={(e) => e.stopPropagation()}
              draggable={false}
            />
            {count > 1 && (
              <>
                <button aria-label="Previous image" className={`${arrow} left-0 sm:left-4`}
                  onClick={(e) => { e.stopPropagation(); go(-1); }}>
                  <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
                </button>
                <button aria-label="Next image" className={`${arrow} right-0 sm:right-4`}
                  onClick={(e) => { e.stopPropagation(); go(1); }}>
                  <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
                </button>
              </>
            )}
          </div>

          {count > 1 && (
            <div className="mt-4 flex flex-col items-center gap-3 w-full" onClick={(e) => e.stopPropagation()}>
              <p className="text-white/80 text-sm">{index + 1} / {count}</p>
              <div className="flex gap-2 overflow-x-auto max-w-full px-2 pb-1">
                {images.map((img, i) => (
                  <button key={i} aria-label={`Show image ${i + 1}`} onClick={() => setIndex(i)}
                    className={`flex-shrink-0 rounded border-2 transition ${i === index ? "border-white" : "border-transparent opacity-60 hover:opacity-100"}`}>
                    <img src={img} alt="" className="h-14 w-20 object-cover rounded" draggable={false} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
