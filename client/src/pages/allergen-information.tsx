import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function AllergenInformation() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black text-white py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center text-gold hover:text-yellow-400 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-serif font-bold">
            Allergen <span className="text-gold">Information</span>
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Important Notice */}
        <Card className="mb-8 border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center text-amber-800">
              <AlertTriangle className="w-6 h-6 mr-2" />
              Important Notice
            </CardTitle>
          </CardHeader>
          <CardContent className="text-amber-800">
            <p className="font-medium mb-2">
              Please read this information carefully before placing your order, especially if you have allergies or dietary requirements.
            </p>
            <p>
              If you have any specific concerns or questions about allergens, please contact us directly before ordering.
            </p>
          </CardContent>
        </Card>

        {/* Allergen Information */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          
          {/* Standard Ingredients */}
          <Card>
            <CardHeader>
              <CardTitle className="text-gold">Standard Ingredients</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Unless specifically requested otherwise, our cakes typically contain:
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-gold rounded-full"></span>
                  <span><strong>Gluten</strong> (wheat flour)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-gold rounded-full"></span>
                  <span><strong>Dairy</strong> (milk, butter, cream)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-gold rounded-full"></span>
                  <span><strong>Eggs</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-gold rounded-full"></span>
                  <span><strong>Nuts</strong> (may contain various nuts)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-gold rounded-full"></span>
                  <span><strong>Soya</strong> (in some products)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Special Dietary Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-gold">Special Dietary Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                We can accommodate special dietary requirements when requested:
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span><strong>Gluten-Free</strong> cakes available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span><strong>Dairy-Free</strong> options available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span><strong>Egg-Free</strong> alternatives possible</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span><strong>Nut-Free</strong> cakes can be made</span>
                </div>
              </div>
              <p className="text-sm font-medium text-amber-600 mt-4">
                Please specify your requirements clearly in your order details.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Cross-Contamination Warning */}
        <Card className="mb-8 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Cross-Contamination Warning</CardTitle>
          </CardHeader>
          <CardContent className="text-red-800 space-y-3">
            <p>
              <strong>Important:</strong> All our products are made in a kitchen that handles wheat, eggs, milk, nuts, and other allergens.
            </p>
            <p>
              While we take precautions to avoid cross-contamination when making allergen-free products, we <strong>cannot guarantee</strong> that our products are completely free from traces of allergens.
            </p>
            <p>
              If you have a severe allergy, please consider whether our products are suitable for you. We recommend consulting with your healthcare provider if you're unsure.
            </p>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          
          {/* Decoration & Toppings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-gold">Decorations & Toppings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">
                Please be aware that decorative elements may contain additional allergens:
              </p>
              <ul className="space-y-1 text-sm">
                <li>• Chocolate decorations may contain milk and nuts</li>
                <li>• Fondant and sugar paste are typically gluten-free</li>
                <li>• Food colourings are generally allergen-free</li>
                <li>• Fresh fruits are naturally allergen-free</li>
                <li>• Edible flowers and decorations vary by type</li>
              </ul>
            </CardContent>
          </Card>

          {/* Storage & Handling */}
          <Card>
            <CardHeader>
              <CardTitle className="text-gold">Storage & Handling</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">
                For food safety and quality:
              </p>
              <ul className="space-y-1 text-sm">
                <li>• Collect cakes as close to event time as possible</li>
                <li>• Store in refrigerator if containing fresh cream</li>
                <li>• Consume within 2-3 days of collection</li>
                <li>• Keep away from strong odours</li>
                <li>• Room temperature 30 minutes before serving</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <Card className="bg-gold text-black">
          <CardHeader>
            <CardTitle>Questions About Allergens?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              If you have specific questions about allergens or ingredients in our products, please don't hesitate to contact us:
            </p>
            <div className="space-y-2">
              <p><strong>Email:</strong> normanbakes38@gmail.com</p>
              <p><strong>Phone:</strong> Available upon request</p>
              <p><strong>Facebook:</strong> Norman Bakes</p>
            </div>
            <p className="mt-4 text-sm">
              We're happy to discuss your specific requirements and help ensure you can enjoy our cakes safely.
            </p>
          </CardContent>
        </Card>

        {/* Back to Order */}
        <div className="text-center mt-8">
          <Link 
            href="/#order" 
            className="inline-block bg-black text-gold px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Place Your Order
          </Link>
        </div>
      </main>
    </div>
  );
}