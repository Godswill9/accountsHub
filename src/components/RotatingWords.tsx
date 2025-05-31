// import React, { useEffect, useState } from "react";
// import { getPlatformImage } from "@/utils/platformImages";

// export const RotatingWords = () => {
//   const items = [
//     { name: "Facebook", image: getPlatformImage("Facebook") },
//     { name: "Twitter", image: getPlatformImage("Twitter") },
//     { name: "Instagram", image: getPlatformImage("Instagram") },
//     { name: "LinkedIn", image: getPlatformImage("LinkedIn") },
//     { name: "Snapchat", image: getPlatformImage("Snapchat") },
//     { name: "YouTube", image: getPlatformImage("YouTube") },
//     { name: "Pinterest", image: getPlatformImage("Pinterest") },
//     { name: "Reddit", image: getPlatformImage("Reddit") },
//     { name: "Tumblr", image: getPlatformImage("Tumblr") },
//   ];

//   const [index, setIndex] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setIndex((prev) => ((prev + 1) % items.length));
//     }, 2000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="w-56 h-16 rounded-[1.25rem] bg-[#f0f0f3] shadow-neumorphic overflow-hidden relative mx-auto flex items-center justify-center">
//       <div
//         className="flex flex-col transition-transform duration-700 ease-in-out"
//         style={{ transform: `translateY(-${index * 4}rem)` }}
//       >
//         {items.map((item, i) => (
//           <div
//             key={i}
//             className="h-16 flex items-center justify-center gap-3 text-gray-700 text-lg font-semibold"
//           >
//             <div className="w-10 h-10 rounded-full shadow-inner bg-white flex items-center justify-center">
//               <img src={item.image} alt={item.name} className="w-7 h-7" />
//             </div>
//             {item.name}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

import React, { useEffect, useState } from "react";
import { getPlatformImage } from "@/utils/platformImages";

export const RotatingWords = () => {
  const items = [
    { name: "Facebook", image: getPlatformImage("Facebook") },
    { name: "Twitter", image: getPlatformImage("Twitter") },
    { name: "Instagram", image: getPlatformImage("Instagram") },
    { name: "LinkedIn", image: getPlatformImage("LinkedIn") },
    { name: "Snapchat", image: getPlatformImage("Snapchat") },
    { name: "YouTube", image: getPlatformImage("YouTube") },
    { name: "Pinterest", image: getPlatformImage("Pinterest") },
    { name: "Reddit", image: getPlatformImage("Reddit") },
    { name: "Tumblr", image: getPlatformImage("Tumblr") },
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-16 overflow-hidden relative w-64">
      <div
        className="flex flex-col transition-transform duration-500 ease-in-out"
        style={{ transform: `translateY(-${index * 4}rem)` }} // 4rem = height of each item
      >
        {items.map((item, i) => (
          <div
            key={i}
            className="h-16 flex items-center justify-center gap-4 text-yellow-300 text-3xl font-extrabold"
          >
            <img src={item.image} alt={item.name} className="w-10 h-10" />
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};
