import { useState } from "react";
import Lightbox from "@/components/ui/lightbox";

import wickedCakeImage from "@assets/image_1751230988004.png";
import cupcakeCollectionImage from "@assets/image_1751231039598.png";
import stitchCakeImage from "@assets/image_1751231066978.png";
import birthdayCakeImage from "@assets/image_1751231108004.png";
import portiaCakeImage from "@assets/image_1751231154422.png";
import heartCakesImage from "@assets/image_1751231200383.png";
import newCupcakesImage from "@assets/new_cupcakes_2025.jpeg";
import additionalCake1Image from "@assets/additional_cake_1.jpeg";
import additionalCake2Image from "@assets/additional_cake_2.jpeg";
import additionalCake3Image from "@assets/additional_cake_3.jpeg";

const galleryImages = [
  {
    src: wickedCakeImage,
    alt: "Stunning Wicked-themed birthday cake with green and pink split design featuring Elphaba and Glinda"
  },
  {
    src: cupcakeCollectionImage,
    alt: "Collection of themed cupcakes including elegant black and gold designs, honey-themed boxes, and football cupcakes"
  },
  {
    src: stitchCakeImage,
    alt: "Tropical Stitch-themed birthday cake with Hawaiian flowers and surfboard decorations"
  },
  {
    src: birthdayCakeImage,
    alt: "Elegant 50th birthday cake decorated with delicate buttercream flowers and purple ribbon"
  },
  {
    src: portiaCakeImage,
    alt: "Sophisticated black and gold Portia birthday cake with matching cupcakes in presentation box"
  },
  {
    src: heartCakesImage,
    alt: "Collection of celebration cakes including heart-shaped designs, anniversary cakes, and themed creations"
  },
  {
    src: newCupcakesImage,
    alt: "Beautiful collection of freshly decorated cupcakes showcasing Norman Bakes' artistry"
  },
  {
    src: additionalCake1Image,
    alt: "Stunning custom cake creation demonstrating Norman Bakes' exceptional decorating skills"
  },
  {
    src: additionalCake2Image,
    alt: "Elegant celebration cake featuring Norman Bakes' signature design style"
  },
  {
    src: additionalCake3Image,
    alt: "Premium cake design showcasing Norman Bakes' attention to detail and craftsmanship"
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
          <p className="text-gray-700 text-lg max-w-2xl mx-auto mb-4">
            Browse through our collection of stunning cake creations, each one crafted with meticulous attention to detail and artistic flair.
          </p>
          <p className="text-gold font-medium text-lg">
            📸 See more of our cake creations on <a href="https://www.facebook.com/NormanBakesCakesToDieFor" target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-600">Facebook</a> and <a href="https://www.instagram.com/normanbakes38" target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-600">Instagram</a>
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
