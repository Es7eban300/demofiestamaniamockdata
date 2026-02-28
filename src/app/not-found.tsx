import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-7xl mb-4">🎈</p>
      <h1 className="font-display text-4xl font-bold text-dark mb-2">
        ¡Ups! Página no encontrada
      </h1>
      <p className="text-muted-foreground max-w-md mb-8">
        Parece que este artículo de fiesta voló muy alto. La página que buscas no existe.
      </p>
      <Button asChild className="bg-dark hover:bg-dark/90 text-white rounded-full px-8 h-11">
        <Link href="/">Volver al inicio</Link>
      </Button>
    </div>
  );
}
