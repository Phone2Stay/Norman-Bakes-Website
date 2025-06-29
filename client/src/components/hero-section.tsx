import { Button } from "@/components/ui/button";

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
        <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6">
          <span className="text-gold">Norman Bakes</span>
        </h1>
        <p className="text-2xl md:text-3xl font-serif text-gold mb-8">Cakes to Die For</p>
        <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto">
          Bespoke celebration cakes crafted with love in Barry, Vale of Glamorgan. 
          From elegant wedding cakes to delightful birthday treats, every creation is a masterpiece.
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
