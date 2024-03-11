import Image from 'next/image'
 
export default function Logo({src}) {
  return (
    <Image
      src={src}
      width={400}
      height={200}
      className='header-logo'
      alt="Picture of the author"
    />
  )
}