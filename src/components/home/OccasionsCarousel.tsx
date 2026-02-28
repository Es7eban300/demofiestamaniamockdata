import Link from "next/link";
import { Cake, Baby, GraduationCap, Heart, Star, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
} from "@/components/ui/carousel";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { MOCK_OCCASIONS } from "@/data/occasions";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Cake,
  Baby,
  GraduationCap,
  Heart,
  Star,
};

export function OccasionsCarousel() {
  return (
    <section className="section-py bg-white">
      <div className="container-site">
        <SectionHeader
          title="Empieza la Fiesta."
          subtitle="Elige una ocasión para explorar los artículos perfectos."
          align="center"
          className="mb-8"
        />

        <Carousel
          opts={{ align: "start", loop: true, dragFree: true }}
          className="w-full"
        >
          <CarouselContent className="-ml-3">
            {MOCK_OCCASIONS.map((occasion) => {
              const Icon = ICON_MAP[occasion.icon] ?? Star;
              return (
                <CarouselItem
                  key={occasion.id}
                  className="pl-3 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
                >
                  <Link
                    href={`/occasions/${occasion.slug}`}
                    className="flex flex-col items-center gap-3 group"
                  >
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110 shadow-sm"
                      style={{ backgroundColor: occasion.color }}
                    >
                      <Icon className="w-9 h-9 text-dark" />
                    </div>
                    <span className="text-sm font-medium text-dark text-center leading-tight">
                      {occasion.name}
                    </span>
                  </Link>
                </CarouselItem>
              );
            })}

            {/* "Ver más" item */}
            <CarouselItem className="pl-3 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6">
              <Link
                href="/occasions"
                className="flex flex-col items-center gap-3 group"
              >
                <div className="w-20 h-20 rounded-full bg-dark flex items-center justify-center transition-transform duration-200 group-hover:scale-110 shadow-sm">
                  <ChevronRight className="w-8 h-8 text-white" />
                </div>
                <span className="text-sm font-medium text-dark text-center leading-tight">
                  Ver más
                </span>
              </Link>
            </CarouselItem>
          </CarouselContent>
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
    </section>
  );
}
