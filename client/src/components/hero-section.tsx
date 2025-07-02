import { Button } from "@/components/ui/button";
import normanBakesLogo from "@assets/image_1751232026666.png";

export default function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative bg-black text-white min-h-screen flex items-center">
      <div className="absolute inset-0 opacity-40">
        <img 
          src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080" 
          alt="Luxury wedding cake background" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <img 
            src={normanBakesLogo} 
            alt="Norman Bakes - Cakes to Die For" 
            className="mx-auto h-48 md:h-64 w-auto"
          />
        </div>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Bespoke celebration cakes crafted with love in Barry, Vale of Glamorgan. 
          From elegant wedding cakes to delightful birthday treats, every creation is a masterpiece.
        </p>
        <p className="text-gold font-semibold text-lg mb-12">
          Collection Only: 1 Dale Court, Ramsey Road, Barry, CF62 9DJ
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => scrollToSection('gallery')}
            className="bg-gold hover:bg-gold-dark text-black px-8 py-3 font-semibold"
            size="lg"
          >
            View Our Creations
          </Button>
          <Button 
            onClick={() => scrollToSection('order')}
            variant="outline"
            className="border-2 border-gold text-gold hover:bg-gold hover:text-black px-8 py-3 font-semibold"
            size="lg"
          >
            Order Your Cake
          </Button>
        </div>
      </div>
    </section>
  );
}
