import { useState } from "react";
import Lightbox from "@/components/ui/lightbox";

const galleryImages = [
  {
    src: "/attached_assets/image0_1751219767290.jpeg",
    alt: "Norman Bakes signature cake creation"
  },
  {
    src: "/attached_assets/image1_1751219771969.jpeg",
    alt: "Beautiful celebration cake by Norman Bakes"
  },
  {
    src: "/attached_assets/image2_1751219775299.jpeg",
    alt: "Custom designed cake with intricate details"
  },
  {
    src: "/attached_assets/image3_1751219779374.jpeg",
    alt: "Elegant wedding cake design"
  },
  {
    src: "/attached_assets/image5_1751219782485.jpeg",
    alt: "Specialty themed cake creation"
  },
  {
    src: "/attached_assets/image6_1751219784941.jpeg",
    alt: "Delicious birthday cake design"
  },
  {
    src: "/attached_assets/image7_1751219787363.jpeg",
    alt: "Professional cake artistry"
  },
  {
    src: "/attached_assets/image8_1751219790100.jpeg",
    alt: "Custom celebration cake"
  },
  {
    src: "/attached_assets/image9_1751219794918.jpeg",
    alt: "Beautiful cake with detailed decorations"
  },
  {
    src: "/attached_assets/image10_1751219802338.jpeg",
    alt: "Anniversary cake with gold accents"
  },
  {
    src: "/attached_assets/image11_1751219807500.jpeg",
    alt: "Specialty design cake"
  },
  {
    src: "/attached_assets/image12_1751219810295.jpeg",
    alt: "Norman Bakes premium cake design"
  },
  {
    src: "/attached_assets/image13_1751219817048.jpeg",
    alt: "Custom themed celebration cake"
  },
  {
    src: "/attached_assets/image14_1751219819158.jpeg",
    alt: "Elegant cake with floral details"
  },
  {
    src: "/attached_assets/image15_1751219840738.jpeg",
    alt: "Professional wedding cake design"
  },
  {
    src: "/attached_assets/image16_1751219825053.jpeg",
    alt: "Birthday cake with custom decorations"
  },
  {
    src: "/attached_assets/image19_1751219837235.jpeg",
    alt: "Luxury cake design by Norman Bakes"
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
