import Link from "next/link";
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { NewsletterForm } from "./NewsletterForm";

const shopLinks = [
  { label: "Ver Todo", href: "/products" },
  { label: "Ocasiones", href: "/occasions" },
  { label: "Temas", href: "/themes" },
  { label: "Artículos de Fiesta", href: "/categories" },
  { label: "Bundle Deals", href: "/bundles" },
  { label: "Planear Mi Evento", href: "/plan-my-event" },
];

const serviceLinks = [
  { label: "Preguntas Frecuentes", href: "/faq" },
  { label: "Envíos y Entregas", href: "/shipping" },
  { label: "Devoluciones", href: "/returns" },
  { label: "Rastrear Pedido", href: "/rastrear-pedido" },
  { label: "Contáctanos", href: "/contact" },
  { label: "Blog de Fiestas", href: "/blog" },
];

export function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="container-site py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand + Address */}
          <div>
            <Link href="/" className="font-bold text-xl tracking-tight text-white">
              🎉 FIESTA<span style={{ color: "var(--pink-accent)" }}>MANIA</span>
            </Link>
            <p className="mt-3 text-sm text-white/60 leading-relaxed">
              Tu tienda favorita para todo lo que necesitas en tu próxima fiesta.
            </p>
            <div className="mt-5 space-y-2 text-sm text-white/60">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Av. Juárez 1234, Col. Centro<br />Ciudad de México, CDMX 06000</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" />
                <span>+52 (55) 1234-5678</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" />
                <span>hola@fiestamania.mx</span>
              </div>
            </div>
          </div>

          {/* FiestaMania Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-white/80 mb-4">
              FiestaMania
            </h4>
            <ul className="space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-white/80 mb-4">
              Servicio al Cliente
            </h4>
            <ul className="space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-white/80 mb-4">
              Mantente al Día
            </h4>
            <p className="text-sm text-white/60 mb-4 leading-relaxed">
              Recibe ideas, descuentos exclusivos y novedades antes que nadie.
            </p>
            <NewsletterForm />

            {/* Social */}
            <div className="flex items-center gap-3 mt-6">
              {[
                { Icon: Instagram, href: "#", label: "Instagram" },
                { Icon: Facebook, href: "#", label: "Facebook" },
                { Icon: Youtube, href: "#", label: "YouTube" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-white/10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© 2025 FiestaMania. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white/70 transition-colors">
              Privacidad
            </Link>
            <Link href="/terms" className="hover:text-white/70 transition-colors">
              Términos
            </Link>
            <Link href="/cookies" className="hover:text-white/70 transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
