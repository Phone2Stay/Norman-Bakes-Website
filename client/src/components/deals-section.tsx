import { useRef } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const deals = [
  {
    title: "Wedding Package",
    description: "Complete wedding cake service with consultation, bespoke design, and delivery to your venue.",
    price: "From £280",
    subtitle: "Starting with 2-tier design",
    features: [
      "Free design consultation",
      "Cake tasting session",
      "Professional venue delivery",
      "Cake knife & server included"
    ]
  },
  {
    title: "Celebration Special",
    description: "Perfect for birthdays, anniversaries, and special occasions with personalised touches.",
    price: "From £65",
    subtitle: "6-8 inch cakes available",
    features: [
      "Personalised message",
      "Choice of sponge flavours",
      "Custom colour scheme",
      "Elegant gift box"
    ]
  },
  {
    title: "Cupcake Collections",
    description: "Beautifully decorated cupcakes perfect for parties, offices, or gift giving.",
    price: "From £35",
    subtitle: "Dozen mixed selection",
    features: [
      "Variety of flavours",
      "Decorative toppers",
      "Presentation boxes",
      "Bulk order discounts"
    ]
  },
  {
    title: "Christening Cakes",
    description: "Delicate designs for baptisms and christenings with traditional or modern styling.",
    price: "From £70",
    subtitle: "Serves 15-20 people",
    features: [
      "Religious or secular designs",
      "Soft pastel colours",
      "Personalised details",
      "Photography-ready finish"
    ]
  },
  {
    title: "Themed Creations",
    description: "Custom character and hobby-themed cakes bringing your vision to life.",
    price: "From £90",
    subtitle: "Detailed sculpted designs",
    features: [
      "3D character work",
      "Edible image options",
      "Hand-modelled details",
      "Any theme possible"
    ]
  }
];

export default function DealsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = 320;
      containerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="deals" className="py-20 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl font-bold mb-4">
            Special <span className="text-gold">Deals</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Discover our current offers and packages designed to make your celebration even sweeter.
          </p>
        </div>
        
        <div className="relative">
          <div 
            ref={containerRef}
            className="flex overflow-x-auto space-x-6 pb-6 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {deals.map((deal, index) => (
              <div key={index} className="flex-none w-80 bg-charcoal p-8 rounded-lg">
                <div className="text-center">
                  <h3 className="font-serif text-2xl font-bold text-gold mb-4">{deal.title}</h3>
                  <p className="text-gray-300 mb-6">{deal.description}</p>
                  <div className="text-3xl font-bold text-white mb-2">{deal.price}</div>
                  <p className="text-sm text-gray-400 mb-6">{deal.subtitle}</p>
                  <ul className="text-left text-gray-300 space-y-2 mb-6">
                    {deal.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="text-gold mr-2" size={16} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          
          <Button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gold hover:bg-gold-dark text-black p-2 rounded-full shadow-lg"
            size="icon"
          >
            <ChevronLeft size={20} />
          </Button>
          <Button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gold hover:bg-gold-dark text-black p-2 rounded-full shadow-lg"
            size="icon"
          >
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>
    </section>
  );
}
