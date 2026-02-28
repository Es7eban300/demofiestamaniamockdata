import { SectionHeader } from "@/components/shared/SectionHeader";
import { ProductCard } from "@/components/products/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ON_SALE_PRODUCTS } from "@/data/products";

export function OnSaleSection() {
  return (
    <section className="section-py bg-cream">
      <div className="container-site">
        <SectionHeader
          title="En Oferta"
          ctaLabel="Ver todas las ofertas"
          ctaHref="/products?sale=true"
          className="mb-6"
        />

        <div className="relative">
          <Carousel
            opts={{ align: "start", dragFree: true }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {ON_SALE_PRODUCTS.map((product) => (
                <CarouselItem
                  key={product.id}
                  className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
                >
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex -left-4 bg-white shadow-card" />
            <CarouselNext className="hidden sm:flex -right-4 bg-white shadow-card" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
