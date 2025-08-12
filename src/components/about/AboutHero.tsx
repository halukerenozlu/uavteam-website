import Image from "next/image";

export default function AboutHero() {
  return (
    <div className="relative w-screen h-[60vh] mb-16">
      <Image
        src="/about.jpg"
        alt="About Background"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-5xl font-bold text-white drop-shadow-lg">About</h1>
      </div>
    </div>
  );
}
