import { useState } from "react";
import Lightbox from "@/components/ui/lightbox";

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
    alt: "Three-tier white wedding cake with gold accents and floral decorations"
  },
  {
    src: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
    alt: "Colourful birthday cake with rainbow layers and buttercream frosting"
  },
  {
    src: "https://pixabay.com/get/g7b8eab98d7ff09c6f155f18dc59c04925c1849cbe86dfc482f5cdf2197e43e191bde1b8f92f21041d8a7b7ea2cb477b7e7f43458e6ae068af30e0420977a5dba_1280.jpg",
    alt: "Decadent chocolate cake with gold leaf decoration and berry garnish"
  },
  {
    src: "https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
    alt: "Assortment of gourmet cupcakes with various flavours and decorative toppings"
  },
  {
    src: "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
    alt: "Elegant two-tier anniversary cake with gold detailing and fresh flowers"
  },
  {
    src: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
    alt: "Custom themed celebration cake with intricate fondant work and vibrant colours"
  },
  {
    src: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
    alt: "Elegant dessert table with various cakes, tarts, and pastries"
  },
  {
    src: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
    alt: "Seasonal fruit cake with fresh berries and elegant presentation"
  }
];

export default function GallerySection() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{src: string, alt: string} | null>(null);

  const openLightbox = (image: {src: string, alt: string}) => {
    setSelectedImage(image);
    setLightboxOpen(true);
  };

  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl font-bold text-charcoal mb-4">
            Our <span className="text-gold">Gallery</span>
          </h2>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            Browse through our collection of stunning cake creations, each one crafted with meticulous attention to detail and artistic flair.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <div 
              key={index} 
              className="gallery-item cursor-pointer group"
              onClick={() => openLightbox(image)}
            >
              <img 
                src={image.src} 
                alt={image.alt} 
                className="w-full h-80 object-cover rounded-lg shadow-lg group-hover:shadow-xl transition-shadow"
              />
            </div>
          ))}
        </div>
      </div>

      <Lightbox 
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        image={selectedImage}
      />
    </section>
  );
}
