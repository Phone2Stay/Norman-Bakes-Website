import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReturnPolicy() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Return Policy</h1>
          <p className="text-gray-600">Norman Bakes - Refunds, Cancellation & Postponement Policy</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">REFUNDS/CANCELLATION/POSTPONEMENT POLICY</h2>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">POSTPONEMENT</h3>
              <p className="text-gray-700 mb-2">
                If for any reason the event is required to be postponed, please contact me immediately.
              </p>
              <p className="text-gray-700">
                The new date proposed will be subject to availability.
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">CANCELLATIONS/REFUNDS</h3>
              <p className="text-gray-700 mb-4">
                If cancellation of the order is required, and you have paid your full balance, the refund policy is as follows:
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-gray-700 mb-2">
                  <strong>If the cancellation is up to one (1) month in advance of your event date:</strong><br />
                  You will receive a refund, less your initial deposit and the cost of any supplies already purchased for your cake.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-gray-700 mb-2">
                  <strong>If the cancellation is less than seven (7) days prior to your event:</strong><br />
                  There will be absolutely no refunds given.
                </p>
              </div>

              <p className="text-gray-700">
                Refunds will be paid within 30 days of cancellation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}