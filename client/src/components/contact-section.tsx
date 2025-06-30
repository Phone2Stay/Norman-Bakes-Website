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
            <div className="bg-gray-100 rounded-lg shadow-lg p-6 text-center">
              <svg className="w-full h-64 mx-auto mb-4" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                {/* Wales coastline outline */}
                <path d="M50 250 Q80 240 120 230 Q160 220 200 210 Q240 200 280 210 Q320 220 350 230" 
                      fill="none" stroke="#3b82f6" strokeWidth="3"/>
                
                {/* Cardiff area */}
                <circle cx="180" cy="180" r="4" fill="#6b7280" />
                <text x="185" y="185" className="text-xs" fill="#6b7280">Cardiff</text>
                
                {/* Barry location - highlighted */}
                <circle cx="160" cy="200" r="6" fill="#d97706" />
                <text x="125" y="195" className="text-sm font-bold" fill="#d97706">Barry</text>
                <text x="110" y="210" className="text-xs" fill="#d97706">Vale of Glamorgan</text>
                
                {/* Roads */}
                <path d="M160 200 L180 180" stroke="#9ca3af" strokeWidth="2" strokeDasharray="5,5" />
                <path d="M160 200 Q200 190 240 185" stroke="#9ca3af" strokeWidth="1" strokeDasharray="3,3" />
                
                {/* Bristol Channel label */}
                <text x="200" y="250" className="text-sm" fill="#3b82f6">Bristol Channel</text>
                
                {/* Compass */}
                <g transform="translate(320, 50)">
                  <circle cx="0" cy="0" r="20" fill="white" stroke="#6b7280" strokeWidth="1" />
                  <path d="M0,-15 L5,0 L0,15 L-5,0 Z" fill="#d97706" />
                  <text x="0" y="-25" className="text-xs" textAnchor="middle" fill="#6b7280">N</text>
                </g>
              </svg>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Our Location</h3>
                <p className="text-gray-600">Based in Barry, Vale of Glamorgan</p>
                <p className="text-sm text-gray-500 mt-1">Serving South Wales with delicious cakes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
