import { useState } from "react";
import Lightbox from "@/components/ui/lightbox";

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    alt: "Elegant three-tier wedding cake with gold accents and floral decorations"
  },
  {
    src: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    alt: "Colourful children's birthday cake with vibrant rainbow layers"
  },
  {
    src: "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    alt: "Sophisticated anniversary cake with gold detailing and fresh flowers"
  },
  {
    src: "https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    alt: "Gourmet cupcake selection with various flavours and artistic decorations"
  },
  {
    src: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    alt: "Custom themed celebration cake with intricate fondant work"
  },
  {
    src: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    alt: "Seasonal fruit cake with fresh berries and elegant presentation"
  },
  {
    src: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    alt: "Luxury dessert table featuring various celebration cakes"
  },
  {
    src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    alt: "Artisan chocolate cake with gold leaf and berry garnish"
  },
  {
    src: "https://images.unsplash.com/photo-1603532648955-039310d9ed75?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    alt: "Rustic naked cake with fresh flowers and natural decorations"
  },
  {
    src: "https://images.unsplash.com/photo-1607478900766-efe13248b125?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    alt: "Modern geometric wedding cake with black and gold design"
  },
  {
    src: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    alt: "Vintage-style buttercream cake with delicate piped flowers"
  },
  {
    src: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    alt: "Celebration cake with personalised message and themed decorations"
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {galleryImages.map((image, index) => (
            <div 
              key={index} 
              className="gallery-item cursor-pointer group relative overflow-hidden rounded-lg"
              onClick={() => openLightbox(image)}
            >
              <img 
                src={image.src} 
                alt={image.alt} 
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                <div className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center px-4">
                  {image.alt}
                </div>
              </div>
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
