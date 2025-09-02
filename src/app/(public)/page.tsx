import Hero from "@/components/hero/Hero";
import FeaturedVehicleCarousel from "@/app/(public)/_sections/FeaturedVehicleCarousel";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SponsorsCarousel from "@/components/sponsor/SponsorsCarousel";
import HomeNews from "@/app/(public)/_sections/HomeNews";

export default function HomePage() {
  return (
    <>
      <Hero
        imageSrc="/nokta.png"
        videoSrc="/Huawei P10.mp4"
        title="KUASAR UAV TEAM"
        subtitle="Become a part of the most innovative projects and be part of a passionate team"
      />
      <main className="bg-white text-black !px-6 !sm:px-0">
        {/* About Section */}
        <section id="about" className="bg-white text-black py-16">
          <div className="container">
            <div className="w-full px-8">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Sol taraf - Resim */}
                <div className="relative">
                  <Image
                    src="/nokta.png"
                    alt="About Kuasar UAV"
                    width={500}
                    height={400}
                    className="rounded-lg object-cover transform scale-75"
                  />
                </div>

                {/* Sağ taraf - İçerik */}
                <div className="space-y-6 flex flex-col items-center justify-center h-full">
                  <h2 className="text-4xl font-bold text-black text-center">
                    About
                  </h2>
                  <div className="h-[15px]"></div>
                  <div className="w-32 h-1 bg-red-500 mb-6"></div>
                  <div className="h-[25px]"></div>
                  <p className="text-black text-lg leading-relaxed text-center">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia.
                  </p>
                  <div className="h-[40px]" />
                  <div className="flex justify-center mt-8">
                    <Link href="/about" className="flex justify-center mt-8">
                      <Button
                        variant="default"
                        size="lg"
                        className="bg-black text-white hover:bg-gray-800 item !px-5"
                      >
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="h-[25px]"></div>

        {/* Vehicles Section */}
        <section id="vehicles" className="bg-white text-black py-16">
          <div className="container">
            <div className="w-full px-8">
              <div className="w-full grid md:grid-cols-2 gap-36 items-center">
                {/* Sol taraf - Başlık ve Buton */}
                <div className="space-y-6 flex flex-col items-center justify-center h-full">
                  <div className="w-full flex flex-col items-center">
                    <h2 className="text-4xl font-bold text-black mb-4">
                      Our Vehicles
                    </h2>
                    <div className="h-[15px]"></div>
                    <div className="w-32 h-1 bg-red-500 mb-6"></div>
                    <div className="h-[25px]"></div>
                    <p className="text-black text-lg leading-relaxed text-center">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      Duis aute irure dolor in reprehenderit in voluptate velit
                      esse cillum dolore eu fugiat nulla pariatur.
                    </p>
                    <div className="h-[40px]" />
                  </div>
                  <div className="flex justify-center  mt-8">
                    <Link href="/vehicles" className="flex justify-center mt-8">
                      <Button
                        variant="default"
                        size="lg"
                        className="bg-black text-white hover:bg-gray-800 !px-5"
                      >
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Sağ taraf - Carousel */}
                <div className="w-full flex justify-center">
                  {/* DB'den gelen görseller */}
                  <FeaturedVehicleCarousel take={5} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="h-[45px]"></div>

        <section id="news" className="bg-white text-black py-16">
          <div className="container">
            <div className="w-full px-8">
              <div className="w-full flex flex-col items-center">
                <h2 className="text-4xl font-bold text-black mb-4">News</h2>
                <div className="h-[15px]" />
                <div className="w-32 h-1 bg-red-500 mb-6" />
                <div className="h-[25px]" />
              </div>
              <HomeNews take={8} />
            </div>
          </div>
        </section>
        <div className="h-[45px]"></div>

        {/* Sponsors Section */}
        <section id="sponsors" className="bg-white text-black py-16">
          <div className="container">
            <div className="w-full px-8">
              <div className="grid md:grid-cols-2 gap-42 items-center">
                {/* Left Column - Text Content */}
                <div className="w-full flex flex-col items-center">
                  <h2 className="text-4xl font-bold text-black">
                    Our Sponsors
                  </h2>
                  <div className="h-[15px]" />
                  <div className="w-32 h-1 bg-red-500 mb-6" />
                </div>

                {/* Right Column - Carousel */}
                <div className="w-full flex justify-center">
                  <SponsorsCarousel />
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="h-[45px]"></div>
      </main>
    </>
  );
}
