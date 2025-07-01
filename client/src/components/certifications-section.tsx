import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Award } from "lucide-react";

import hygieneCertificateImage from "@assets/hygiene_certificate.jpeg";
import hygieneRatingImage from "@assets/hygiene_rating.jpeg";

export default function CertificationsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            Our <span className="text-gold">Certifications</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            We maintain the highest standards of food safety and hygiene to ensure every cake is made in a clean, certified environment.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Food Hygiene Rating */}
          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Shield className="w-12 h-12 text-gold" />
              </div>
              <CardTitle className="text-gold">Food Hygiene Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <img 
                  src={hygieneRatingImage} 
                  alt="Food Hygiene Rating Certificate" 
                  className="w-full max-w-sm mx-auto rounded-lg border shadow-md"
                />
              </div>
              <p className="text-gray-600">
                We proudly maintain our official Food Hygiene Rating, demonstrating our commitment to food safety standards.
              </p>
            </CardContent>
          </Card>

          {/* Food Safety Certificate */}
          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Award className="w-12 h-12 text-gold" />
              </div>
              <CardTitle className="text-gold">Food Safety Certificate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <img 
                  src={hygieneCertificateImage} 
                  alt="Food Safety Training Certificate" 
                  className="w-full max-w-sm mx-auto rounded-lg border shadow-md"
                />
              </div>
              <p className="text-gray-600">
                Our team holds current food safety training certificates, ensuring professional handling of all ingredients and products.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <div className="bg-gold bg-opacity-10 p-6 rounded-lg max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Your Safety is Our Priority
            </h3>
            <p className="text-gray-700">
              We follow strict hygiene protocols and maintain all required certifications to ensure every cake is made safely and to the highest quality standards. Your health and satisfaction are our top priorities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}