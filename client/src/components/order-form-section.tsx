import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

const orderSchema = z.object({
  customerName: z.string().min(1, "Name is required"),
  customerEmail: z.string().email("Valid email is required"),
  customerPhone: z.string().min(1, "Phone number is required"),
  collectionDate: z.string().min(1, "Collection date is required"),
  productType: z.string().min(1, "Product type is required"),
  productDetails: z.string().min(1, "Product details are required"),
  specialRequirements: z.string().optional(),
  extras: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

const productTypes = [
  { value: "brownie-tower", label: "Brownie/Blondie Tower", price: 40 },
  { value: "cupcakes-6", label: "Cupcake box of 6", price: 12 },
  { value: "cupcakes-12", label: "Cupcake box of 12", price: 24 },
  { value: "brownies-box", label: "Brownies/Blondies box", price: 22 },
  { value: "cheesecake-single", label: "Cheesecake (single)", price: 30 },
  { value: "cheesecake-double", label: "Cheesecake (double)", price: 50 },
  { value: "tray-bake", label: "Tray bake", price: 30 },
  { value: "bento-4", label: "Bento Box with 4 cupcakes", price: 35 },
  { value: "bento-8", label: "Bento Box with 8 cupcakes", price: 45 },
  { value: "other-cake", label: "Other Cake", price: 20, isDeposit: true },
];

const extrasOptions = [
  { value: "none", label: "No extras", price: 0 },
  { value: "strawberries", label: "Chocolate covered strawberries", price: 5 },
  { value: "toppers", label: "Cake toppers (specify in details)", price: 10 },
];

function PaymentForm({ orderId, amount, onSuccess }: { orderId: number, amount: number, onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin,
      },
      redirect: 'if_required'
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "Thank you! Your deposit has been processed.",
      });
      onSuccess();
    }
    
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || processing}
        className="w-full bg-gold hover:bg-gold-dark text-black font-semibold"
      >
        {processing ? "Processing..." : `Pay £${amount}`}
      </Button>
    </form>
  );
}

export default function OrderFormSection() {
  const [showPayment, setShowPayment] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
  const { toast } = useToast();
  
  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      collectionDate: "",
      productType: "",
      productDetails: "",
      specialRequirements: "",
      extras: "none",
    }
  });

  const selectedProduct = productTypes.find(p => p.value === form.watch("productType"));
  const selectedExtra = extrasOptions.find(e => e.value === form.watch("extras"));
  
  // Calculate total amount
  const calculateTotal = () => {
    const productPrice = selectedProduct?.price || 0;
    const extraPrice = selectedExtra?.price || 0;
    return productPrice + extraPrice;
  };

  // Check date availability when collection date changes
  const checkDateAvailability = async (date: string) => {
    try {
      const response = await apiRequest("GET", `/api/check-date-availability?date=${date}`);
      const { available } = await response.json();
      return available;
    } catch (error) {
      return true; // Default to available if check fails
    }
  };

  const onSubmit = async (data: OrderFormData) => {
    try {
      // Check date availability first
      const dateAvailable = await checkDateAvailability(data.collectionDate);
      if (!dateAvailable) {
        toast({
          title: "Date Unavailable",
          description: "This date is fully booked. Please select another date.",
          variant: "destructive",
        });
        return;
      }

      const total = calculateTotal();
      const response = await apiRequest("POST", "/api/orders", {
        ...data,
        totalAmount: total
      });
      
      const order = await response.json();
      setOrderId(order.id);
      setTotalAmount(total);
      setShowPayment(true);
      
      const isDeposit = selectedProduct?.isDeposit;
      toast({
        title: "Order Created",
        description: isDeposit 
          ? "Please complete your £20 deposit payment. We'll contact you to discuss the full cake details."
          : `Please complete your £${total} payment.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    form.reset();
    toast({
      title: "Order Complete!",
      description: "Thank you! We'll contact you soon to discuss your order details.",
    });
  };

  if (showPayment && orderId) {
    return (
      <section id="order" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center text-gold">Complete Your Order</CardTitle>
              <p className="text-center text-sm text-gray-600">
                {selectedProduct?.isDeposit 
                  ? `£${totalAmount} deposit required to confirm your order`
                  : `Total payment: £${totalAmount}`
                }
              </p>
            </CardHeader>
            <CardContent>
              <Elements stripe={stripePromise} options={{
                mode: 'payment',
                amount: totalAmount * 100,
                currency: 'gbp',
              }}>
                <PaymentForm orderId={orderId} amount={totalAmount} onSuccess={handlePaymentSuccess} />
              </Elements>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="order" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            Our <span className="text-gold">Products & Pricing</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-8">
            Browse our full range and place your order with a £10 deposit
          </p>
        </div>

        {/* Products & Pricing Display */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-gold">Tier Cakes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>4" Round - <strong>£50</strong></p>
              <p>6" Round - <strong>£70</strong></p>
              <p>8" Round - <strong>£90</strong></p>
              <p className="text-sm text-gray-600">Available in Vanilla, Chocolate, Red Velvet, Lemon, or Carrot sponge</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-gold">Heart Cakes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>Small (2 layers) - <strong>£70</strong></p>
              <p>Large (3 layers) - <strong>£90</strong></p>
              <p className="text-sm text-gray-600">Perfect for anniversaries and romantic occasions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-gold">Cheesecakes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>Single Tier - <strong>£30</strong></p>
              <p>Two Tier - <strong>£50</strong></p>
              <p className="text-sm text-gray-600">Rich and creamy classic dessert</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-gold">Number/Letter Cakes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>1 Digit/Letter - <strong>£70</strong></p>
              <p>2 Digits/Letters - <strong>£110</strong></p>
              <p className="text-sm text-gray-600">Custom shapes for special birthdays</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-gold">Cupcakes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>Standard - <strong>£2 each</strong></p>
              <p>Personalised - <strong>£2.50 each</strong></p>
              <p>Decorated - <strong>£3 each</strong></p>
              <p className="text-sm text-gray-600">Minimum order 6 cupcakes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-gold">Other Treats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>Tray Bakes - <strong>£30</strong></p>
              <p>Bento Cakes - <strong>£40</strong></p>
              <p>Bento Boxes - <strong>£35</strong></p>
              <p>Brownies/Blondies - <strong>£22</strong></p>
            </CardContent>
          </Card>
        </div>

        {/* Available Options */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-gold">Available Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Sponge Flavours:</h4>
                <p className="text-sm text-gray-600">Vanilla, Chocolate, Red Velvet, Lemon, Carrot</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Fillings:</h4>
                <p className="text-sm text-gray-600">Strawberry/Raspberry Jam, Vanilla/Chocolate Buttercream, Lemon Curd, Nutella</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Form */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-gold">Place Your Order</CardTitle>
            <p className="text-center text-sm text-gray-600">
              £10 deposit required - we'll contact you to finalise details and arrange collection
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="customerPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Your contact number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="customerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="collectionDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Required Collection Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="productType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select what you'd like to order" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {productTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label} - £{type.price}{type.isDeposit ? ' (deposit only)' : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedProduct?.isDeposit && (
                        <p className="text-sm text-amber-600 mt-1">
                          This is a £20 deposit. The full price will be discussed and agreed upon based on your specific requirements.
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="extras"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Extras (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select any extras" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {extrasOptions.map((extra) => (
                            <SelectItem key={extra.value} value={extra.value}>
                              {extra.label}{extra.price > 0 ? ` - £${extra.price}` : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="productDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Details</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Please specify: size, flavour, theme, colours, text, quantity, etc. For example: '6 inch vanilla sponge with chocolate buttercream, pink roses theme, Happy Birthday Sarah'"
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="specialRequirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Requirements (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any allergies, dietary requirements, or special requests"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Total Price Display */}
                {selectedProduct && (
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex justify-between items-center text-sm">
                      <span>Product:</span>
                      <span>£{selectedProduct.price}</span>
                    </div>
                    {selectedExtra && selectedExtra.price > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span>Extras:</span>
                        <span>£{selectedExtra.price}</span>
                      </div>
                    )}
                    <hr className="my-2" />
                    <div className="flex justify-between items-center font-semibold">
                      <span>Total:</span>
                      <span>£{calculateTotal()}</span>
                    </div>
                    {selectedProduct.isDeposit && (
                      <p className="text-xs text-amber-600 mt-1">
                        Deposit payment - final price to be agreed
                      </p>
                    )}
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-gold hover:bg-gold-dark text-black font-semibold py-3"
                  size="lg"
                >
                  {selectedProduct?.isDeposit 
                    ? `Place Order & Pay £${calculateTotal()} Deposit`
                    : `Place Order & Pay £${calculateTotal()}`
                  }
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}