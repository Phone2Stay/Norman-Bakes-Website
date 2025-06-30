import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import HeroSection from "@/components/hero-section";
import GallerySection from "@/components/gallery-section";
import DealsSection from "@/components/deals-section";
import OrderFormSection from "@/components/order-form-section";
import ContactSection from "@/components/contact-section";
import { Card, CardContent } from "@/components/ui/card";
import { Gift, Instagram, Facebook, Mail } from "lucide-react";
import type { SeasonalDeal } from "@shared/schema";
import normanBakesLogo from "@assets/image_1751232026666.png";

function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-black shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img 
              src={normanBakesLogo} 
              alt="Norman Bakes Logo" 
              className="h-10 w-auto mr-3"
            />
            <span className="text-gold font-serif text-xl font-bold">Norman Bakes</span>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <button onClick={() => scrollToSection('home')} className="text-white hover:text-gold transition-colors">Home</button>
              <button onClick={() => scrollToSection('gallery')} className="text-white hover:text-gold transition-colors">Gallery</button>
              <button onClick={() => scrollToSection('deals')} className="text-white hover:text-gold transition-colors">Deals</button>
              <button onClick={() => scrollToSection('order')} className="text-white hover:text-gold transition-colors">Order</button>
              <button onClick={() => scrollToSection('contact')} className="text-white hover:text-gold transition-colors">Contact</button>
            </div>
          </div>
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-gold"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {mobileMenuOpen && (
        <div className="md:hidden bg-charcoal">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button onClick={() => scrollToSection('home')} className="block px-3 py-2 text-white hover:text-gold w-full text-left">Home</button>
            <button onClick={() => scrollToSection('gallery')} className="block px-3 py-2 text-white hover:text-gold w-full text-left">Gallery</button>
            <button onClick={() => scrollToSection('deals')} className="block px-3 py-2 text-white hover:text-gold w-full text-left">Deals</button>
            <button onClick={() => scrollToSection('order')} className="block px-3 py-2 text-white hover:text-gold w-full text-left">Order</button>
            <button onClick={() => scrollToSection('contact')} className="block px-3 py-2 text-white hover:text-gold w-full text-left">Contact</button>
          </div>
        </div>
      )}
    </nav>
  );
}

function AboutSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Professional cake decorator working on an elegant cake" 
              className="rounded-lg shadow-lg"
            />
          </div>
          <div>
            <h2 className="font-serif text-4xl font-bold text-charcoal mb-6">
              Crafting Sweet <span className="text-gold">Memories</span>
            </h2>
            <p className="text-gray-700 text-lg mb-6">
              At Norman Bakes, we believe every celebration deserves a cake that's as special as the occasion itself. 
              Based in beautiful Barry, Vale of Glamorgan, we specialise in creating bespoke cakes that combine artistry with exceptional taste.
            </p>
            <p className="text-gray-700 text-lg mb-8">
              From intimate birthday celebrations to grand wedding receptions, our handcrafted creations are designed to make your special moments truly unforgettable.
            </p>
            <div className="flex space-x-6">
              <a 
                href="https://www.instagram.com/normanbakes_cakestodiefor/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gold hover:text-gold-dark text-2xl transition-colors"
              >
                <Instagram size={28} />
              </a>
              <a 
                href="https://www.facebook.com/NormanBakesCakesToDieFor" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gold hover:text-gold-dark text-2xl transition-colors"
              >
                <Facebook size={28} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SeasonalDealsSection() {
  const { data: deals, isLoading } = useQuery<SeasonalDeal[]>({
    queryKey: ['/api/seasonal-deals'],
  });

  if (isLoading) {
    return (
      <section className="py-20 bg-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded mb-4 w-1/3 mx-auto"></div>
              <div className="h-32 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-serif text-4xl font-bold text-charcoal mb-8">
            Seasonal <span className="text-gold">Specials</span>
          </h2>
          
          {deals && deals.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deals.map((deal) => (
                <Card key={deal.id} className="bg-white shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="font-serif text-xl font-bold text-charcoal mb-2">{deal.title}</h3>
                    <p className="text-gray-700 mb-4">{deal.description}</p>
                    {deal.discount && (
                      <p className="text-gold font-semibold mb-2">{deal.discount}</p>
                    )}
                    {deal.validUntil && (
                      <p className="text-sm text-gray-600">Valid until: {deal.validUntil}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-white shadow-lg">
              <CardContent className="p-12">
                <Gift className="text-gold text-6xl mb-6 mx-auto" />
                <h3 className="font-serif text-2xl font-bold text-charcoal mb-4">Coming Soon!</h3>
                <p className="text-gray-700 text-lg">
                  Watch this space for exciting seasonal offers and limited-time specials throughout the year.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <img 
              src={normanBakesLogo} 
              alt="Norman Bakes Logo" 
              className="h-10 w-auto mr-3"
            />
            <span className="font-serif text-xl font-bold text-gold">Norman Bakes</span>
          </div>
          <p className="text-gray-400 mb-6">Cakes to Die For - Crafting sweet memories in Barry, Vale of Glamorgan</p>
          <div className="flex justify-center space-x-6 mb-6">
            <a 
              href="https://www.instagram.com/normanbakes_cakestodiefor/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gold transition-colors"
            >
              <Instagram size={24} />
            </a>
            <a 
              href="https://www.facebook.com/NormanBakesCakesToDieFor" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gold transition-colors"
            >
              <Facebook size={24} />
            </a>
            <a 
              href="mailto:normanbakes38@gmail.com"
              className="text-gray-400 hover:text-gold transition-colors"
            >
              <Mail size={24} />
            </a>
          </div>
          <div className="flex justify-center space-x-6 mb-6 text-sm text-gray-400">
            <Link href="/return-policy" className="hover:text-gold transition-colors">
              Return Policy
            </Link>
            <span>•</span>
            <Link href="/terms-conditions" className="hover:text-gold transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <GallerySection />
      <DealsSection />
      <SeasonalDealsSection />
      <OrderFormSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
