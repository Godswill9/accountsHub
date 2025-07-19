import React, { useState } from "react";

export default function ImageCarouselViewer({ images }: { images: string[] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      {/* Carousel section */}
      <div className="w-full max-w-md overflow-x-auto flex gap-4 rounded-lg p-2 border border-gray-300 shadow-inner scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`screenshot ${index + 1}`}
            className="h-56 w-auto object-cover rounded-lg shadow-md flex-shrink-0 transition-transform duration-300 hover:scale-105 border border-gray-300 cursor-pointer"
            onClick={() => setSelectedImage(img)}
          />
        ))}
      </div>

      {/* Modal preview */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Enlarged"
            className="max-h-[90vh] max-w-[90vw] rounded shadow-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
