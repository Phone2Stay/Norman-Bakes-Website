import { Instagram, Facebook, Mail, MapPin, Clock } from "lucide-react";

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-charcoal text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl font-bold mb-4">
            Get In <span className="text-gold">Touch</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            We'd love to hear from you. Contact us to discuss your cake requirements or ask any questions.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="font-serif text-2xl font-bold text-gold mb-6">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="text-gold mr-4" size={20} />
                <span>normanbakes38@gmail.com</span>
              </div>
              <div className="flex items-center">
                <MapPin className="text-gold mr-4" size={20} />
                <span>Barry, Vale of Glamorgan, Wales</span>
              </div>
              <div className="flex items-center">
                <Clock className="text-gold mr-4" size={20} />
                <span>Orders by appointment</span>
              </div>
            </div>
            
            <div className="mt-8">
              <h4 className="font-serif text-xl font-bold text-gold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a 
                  href="https://www.instagram.com/normanbakes_cakestodiefor/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gold hover:bg-gold-dark text-black p-3 rounded-full transition-colors"
                >
                  <Instagram size={20} />
                </a>
                <a 
                  href="https://www.facebook.com/NormanBakesCakesToDieFor" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gold hover:bg-gold-dark text-black p-3 rounded-full transition-colors"
                >
                  <Facebook size={20} />
                </a>
              </div>
            </div>
          </div>
          
          <div>
            <img 
              src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Beautiful coastal view of Barry, Vale of Glamorgan" 
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
