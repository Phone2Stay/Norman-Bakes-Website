import { useRef } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const deals = [
  {
    title: "Round Cakes",
    description: "Classic round celebration cakes perfect for birthdays, anniversaries, and special occasions.",
    price: "From £50",
    subtitle: "4\", 6\", or 8\" available",
    features: [
      "Choice of 5 sponge flavours",
      "7 filling options available",
      "Custom decorations",
      "Personalised message"
    ]
  },
  {
    title: "Heart Shape Cakes",
    description: "Romantic heart-shaped cakes perfect for Valentine's Day, anniversaries, or expressing love.",
    price: "From £70",
    subtitle: "2 or 3 layer options",
    features: [
      "Small (2 layers) - £70",
      "Large (3 layers) - £90", 
      "Beautiful romantic designs",
      "Perfect for special occasions"
    ]
  },
  {
    title: "Cupcake Selection",
    description: "Individual cupcakes available in boxes of 6 or bulk orders for parties and events.",
    price: "From £2 each",
    subtitle: "Multiple decoration styles",
    features: [
      "Standard (buttercream + sprinkles) - £2",
      "Personalised - £2.50 each",
      "Highly decorated - £3 each",
      "Available in boxes of 6"
    ]
  },
  {
    title: "Number & Letter Cakes",
    description: "Custom shaped cakes for birthdays, anniversaries, and celebrations with personalised toppings.",
    price: "From £70",
    subtitle: "Custom name/age designs",
    features: [
      "1 letter/digit - £70",
      "2 letters/digits - £110",
      "Personalised name toppings",
      "Any flavour combination"
    ]
  },
  {
    title: "Specialty Items",
    description: "Cheesecakes, tray bakes, bento cakes, and brownies for every occasion and taste.",
    price: "From £22",
    subtitle: "Various options available",
    features: [
      "Cheesecakes (single £30, two-tier £50)",
      "Tray bakes - £30",
      "Bento cakes - £40",
      "Brownies/Blondies box - £22"
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
