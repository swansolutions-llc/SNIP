import React from 'react';
import Image from 'next/image';

function Picture({ src, alt, LogoClass }) {
  return (
    <Image
      src={src}
      width={400}
      height={200}
      className={`${LogoClass}`}
      alt={alt}
      loading="lazy"
    />
  );

  
}
export default Picture;


