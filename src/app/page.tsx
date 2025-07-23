"use client";

import Hero from "@/components/hero/Hero";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function HomePage() {
  return (
    <>
      <Hero
        imageSrc="/nokta.png"
        videoSrc="/Huawei P10.mp4"
        title="KUASAR UAV TEAM"
        subtitle="Become a part of the most innovative projects and be part of a passionate team"
      />
      <main className="bg-white text-black">
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
                  <br />
                  <div className="w-32 h-1 bg-red-500 mb-6"></div>
                  <br />
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
                    <Button
                      variant="default"
                      size="lg"
                      className="bg-black text-white hover:bg-gray-800 item"
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

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
                    <br />
                    <div className="w-32 h-1 bg-red-500 mb-6"></div>
                    <br />
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
                    <Button
                      variant="default"
                      size="lg"
                      className="bg-black text-white hover:bg-gray-800 "
                    >
                      Learn More
                    </Button>
                  </div>
                </div>

                {/* Sağ taraf - Carousel */}
                <div className="w-full flex justify-center">
                  <Carousel className="w-full max-w-xs">
                    <CarouselContent>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <CarouselItem key={index}>
                          <div className="p-1">
                            <Card>
                              <CardContent className="flex aspect-square items-center justify-center p-2">
                                <Image
                                  src="/nokta.png"
                                  alt={`Vehicle ${index + 1}`}
                                  width={300}
                                  height={300}
                                  className="rounded-lg object-cover w-full h-full"
                                />
                              </CardContent>
                            </Card>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="h-[45px]"></div>
        {/* Sponsors Section */}
        <section id="sponsors" className="bg-white text-black py-16">
          <div className="container">
            <div className="w-full px-8">
              <div className="grid md:grid-cols-2 gap-48 items-center">
                {/* Sol taraf - Carousel */}
                <div className="w-full flex justify-center">
                  <Carousel className="w-full max-w-xs">
                    <CarouselContent>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <CarouselItem
                          key={index}
                          className="md:basis-1/2 lg:basis-1/2"
                        >
                          <div className="p-1">
                            <Card>
                              <CardContent className="flex aspect-square items-center justify-center p-2">
                                <Image
                                  src="/nokta.png"
                                  alt={`Sponsor ${index + 1}`}
                                  width={300}
                                  height={300}
                                  className="rounded-lg object-cover w-full h-full"
                                />
                              </CardContent>
                            </Card>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </div>

                {/* Sağ taraf - İçerik */}
                <div className="w-full flex flex-col items-center">
                  <h2 className="text-4xl font-bold text-black">
                    Our Sponsors
                  </h2>
                  <br />
                  <div className="w-32 h-1 bg-red-500 mb-6"></div>
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
