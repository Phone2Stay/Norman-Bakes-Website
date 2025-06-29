import { useRef } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const deals = [
  {
    title: "Wedding Package",
    description: "Complete wedding cake service including consultation, custom design, and delivery.",
    price: "From £350",
    subtitle: "3-tier cake serving 60+ guests",
    features: [
      "Free consultation",
      "Custom design",
      "Professional delivery", 
      "Cake knife included"
    ]
  },
  {
    title: "Birthday Special",
    description: "Custom birthday cakes with personalised decorations and your choice of flavours.",
    price: "From £85",
    subtitle: "Serves 12-15 people",
    features: [
      "Custom message",
      "Choice of flavours",
      "Themed decorations",
      "Collection box"
    ]
  },
  {
    title: "Cupcake Dozen",
    description: "Assorted gourmet cupcakes perfect for office treats or small gatherings.",
    price: "£42",
    subtitle: "12 assorted cupcakes",
    features: [
      "6 different flavours",
      "Elegant presentation box",
      "Same-day collection",
      "Corporate discounts available"
    ]
  },
  {
    title: "Anniversary Elegance",
    description: "Romantic anniversary cakes with sophisticated designs and premium ingredients.",
    price: "From £125",
    subtitle: "Serves 20-25 people",
    features: [
      "Elegant design",
      "Premium ingredients",
      "Gold accents",
      "Champagne flavour option"
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
