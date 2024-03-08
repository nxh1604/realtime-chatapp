import Image from "next/image";

const Avatar = ({ src, width = 200, height = 200, alt = "avatar" }: { src: string; width?: number; height?: number; alt?: string }) => {
  return (
    <Image
      className="w-[48px] h-[48px] object-cover object-center rounded-full border-[1px] border-white"
      src={src}
      width={width}
      height={height}
      alt={alt}
    />
  );
};

export default Avatar;
