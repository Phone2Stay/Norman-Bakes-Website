import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms & Conditions</h1>
          <p className="text-gray-600">Norman Bakes - Terms and Conditions of Service</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="prose max-w-none">
            <p className="text-gray-700 mb-6">
              All of my products made by me are subject to the following Terms and Conditions.
            </p>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">INGREDIENTS</h3>
              <p className="text-gray-700 mb-4">
                All cakes, fillings and icings may contain, or come into contact with, soy, wheat, dairy, nuts or other allergens.
              </p>
              <p className="text-gray-700 mb-4">
                It is the responsibility of the Customer to inform me prior to the confirmation of their booking of any allergy issues. It is the responsibility of the Customer to inform their guests of all allergy information and accordingly the Supplier will not be held liable for any allergic reaction resulting from consumption of the cake.
              </p>
              <p className="text-gray-700">
                All products are made to be eaten on the day of the celebration.
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">QUOTATIONS</h3>
              <p className="text-gray-700">
                All Quotations are valid for 7 days from the date of issue.
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">ORDERS</h3>
              <p className="text-gray-700 mb-4">
                I prefer at least fourteen (14) - twenty eight (28) days notice for all orders, as I am continually booked in advance. I will however endeavour, where availability permits accept short notice cakes.
              </p>
              <p className="text-gray-700 mb-4">
                Any Products ordered from a picture or photo of a product produced by any other cake maker, can only be reproduced by me as my interpretation of that product and will NOT be an exact reproduction of the product in the picture or photo.
              </p>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
                <p className="text-yellow-800 font-semibold text-center">
                  SHORT NOTICE ORDERS ARE SUBJECT TO INCUR AN EXTRA CHARGE OF £15.00
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}