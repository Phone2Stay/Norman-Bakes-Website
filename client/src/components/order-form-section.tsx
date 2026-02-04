import { useState, useEffect } from "react";
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

// Helper function to check if date is fully booked
const isFullyBooked = (dateString: string): boolean => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-indexed
  const day = date.getDate();
  
  // Only allow 2025 and 2026 bookings
  if (year !== 2025 && year !== 2026) {
    return true;
  }
  
  // 2025 fully booked dates
  if (year === 2025) {
    // July 12th - 20th
    if (month === 6 && day >= 12 && day <= 20) return true;
    
    // July 25th
    if (month === 6 && day === 25) return true;
    
    // August - entire month blocked
    if (month === 7) return true;
    
    // September - entire month blocked
    if (month === 8) return true;
    
    // October - entire month blocked
    if (month === 9) return true;
    
    // November - entire month blocked
    if (month === 10) return true;
    
    // December - entire month blocked
    if (month === 11) return true;
  }
  
  // 2026 fully booked dates
  if (year === 2026) {
    // January: 1-5, 8-11, 15-17, 21-25, 29-31
    if (month === 0 && [1, 2, 3, 4, 5, 8, 9, 10, 11, 15, 16, 17, 21, 22, 23, 24, 25, 29, 30, 31].includes(day)) return true;
    
    // February: 1-15, 23-24, 26-28
    if (month === 1 && [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 23, 24, 26, 27, 28].includes(day)) return true;
    
    // March: entire month blocked
    if (month === 2) return true;
    
    // April: 1-5, 26-30
    if (month === 3 && [1, 2, 3, 4, 5, 26, 27, 28, 29, 30].includes(day)) return true;
    
    // May: 6-11, 13, 22-24
    if (month === 4 && [6, 7, 8, 9, 10, 11, 13, 22, 23, 24].includes(day)) return true;
    
    // June: 14-21
    if (month === 5 && [14, 15, 16, 17, 18, 19, 20, 21].includes(day)) return true;
    
    // July - December: entire months blocked
    if (month >= 6) return true;
  }
  
  return false;
};

const orderSchema = z.object({
  customerName: z.string().min(1, "Name is required"),
  customerEmail: z.string().email("Valid email is required"),
  customerPhone: z.string().min(1, "Phone number is required"),
  collectionDate: z.string().min(1, "Collection date is required").refine(
    (date) => !isFullyBooked(date),
    "This date is fully booked. Please choose a different date."
  ),
  productType: z.string().min(1, "Product type is required"),
  productDetails: z.string().min(1, "Product details are required"),
  specialRequirements: z.string().optional(),
  extras: z.string().optional(),
  referenceImage: z.any().optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

const productTypes = [
  { value: "brownie-tower", label: "Brownie/Blondie Tower", price: 40 },
  { value: "cupcakes-6", label: "Cupcake box of 6", price: 12 },
  { value: "cupcakes-12", label: "Cupcake box of 12", price: 24 },
  { value: "cupcakes-24", label: "Cupcake box of 24", price: 48 },
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
  { value: "cupcake-toppers-6", label: "Cupcake toppers - personalised (box of 6)", price: 3 },
  { value: "cupcake-toppers-12", label: "Cupcake toppers - personalised (box of 12)", price: 6 },
  { value: "cupcake-toppers-24", label: "Cupcake toppers - personalised (box of 24)", price: 12 },
  { value: "decorated-toppers-6", label: "Highly decorated cupcake toppers (box of 6)", price: 6 },
  { value: "decorated-toppers-12", label: "Highly decorated cupcake toppers (box of 12)", price: 12 },
  { value: "decorated-toppers-24", label: "Highly decorated cupcake toppers (box of 24)", price: 24 },
];

function StripePaymentForm({ orderId, amount, onSuccess }: { orderId: number, amount: number, onSuccess: () => void }) {
  const [clientSecret, setClientSecret] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Create payment intent using Netlify Functions
    const createPaymentIntent = async () => {
      try {
        console.log('Creating payment intent for amount:', amount, 'orderId:', orderId);
        const response = await fetch('/.netlify/functions/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: amount,
            orderId: orderId
          })
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Payment setup failed:', response.status, errorText);
          throw new Error(`Payment setup failed: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Payment intent created successfully:', data);
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Payment intent creation failed:', error);
        toast({
          title: "Payment Error",
          description: "Unable to initialize payment. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [amount, orderId, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin w-8 h-8 border-4 border-gold border-t-transparent rounded-full"></div>
        <span className="ml-2">Setting up payment...</span>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="text-center py-8 space-y-4">
        <p className="text-red-600">Payment initialization failed.</p>
        <Button 
          onClick={() => window.location.reload()}
          variant="outline"
        >
          Try Again
        </Button>
      </div>
    );
  }

  console.log('Stripe Promise:', stripePromise);
  console.log('Client Secret:', clientSecret);

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentForm orderId={orderId} amount={amount} onSuccess={onSuccess} />
    </Elements>
  );
}

function PaymentForm({ orderId, amount, onSuccess }: { orderId: number, amount: number, onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);

  console.log('PaymentForm rendered - stripe:', !!stripe, 'elements:', !!elements);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      console.log('Stripe or elements not ready');
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
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      console.log('Payment successful');
      toast({
        title: "Payment Successful",
        description: "Thank you! Your deposit has been processed.",
      });
      onSuccess();
    }
    
    setProcessing(false);
  };

  if (!stripe || !elements) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin w-6 h-6 border-2 border-gold border-t-transparent rounded-full mx-auto"></div>
        <p className="text-sm text-gray-600 mt-2">Loading payment form...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PaymentElement 
        options={{
          layout: 'tabs'
        }}
      />
      <Button 
        onClick={handleSubmit}
        disabled={!stripe || processing}
        className="w-full bg-gold hover:bg-gold-dark text-black font-semibold"
      >
        {processing ? "Processing..." : `Pay £${amount}`}
      </Button>
    </div>
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
      const total = calculateTotal();
      
      // First, create order on server which saves it and sends email notification
      // This ensures we have a record before payment is processed
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          collectionDate: data.collectionDate,
          productType: data.productType,
          productDetails: data.productDetails,
          specialRequirements: data.specialRequirements || '',
          extras: data.extras || 'none',
          totalAmount: total,
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.message || 'Failed to submit order');
      }

      const order = await orderResponse.json();
      
      // Order saved successfully - now proceed to payment
      setOrderId(order.id);
      setTotalAmount(total);
      setShowPayment(true);
      
      const isDeposit = selectedProduct?.isDeposit;
      toast({
        title: "Order Submitted Successfully",
        description: isDeposit 
          ? "Your order has been received. Please complete your £20 deposit payment."
          : `Your order has been received. Please complete your £${total} payment.`,
      });
    } catch (error: any) {
      console.error('Order submission failed:', error);
      toast({
        title: "Order Submission Failed",
        description: error.message || "Failed to submit order. Please try again or contact us directly.",
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
              <StripePaymentForm orderId={orderId} amount={totalAmount} onSuccess={handlePaymentSuccess} />
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
            Browse our full range and place your order
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
              <p className="text-sm text-green-600 font-medium">✓ Gluten-free options available - please specify in order details</p>
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
              <p>Highly decorated - <strong>£3 each</strong></p>
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
            <p className="text-center text-sm text-gray-600 mb-2">
              Collection only from: <strong>1 Dale Court, Ramsey Road, Barry, CF62 9DJ</strong>
            </p>
            <p className="text-center text-sm text-gray-600">
              Full payment required - we'll contact you to arrange collection time
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
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
                        <Input type="text" placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="collectionDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Required Collection Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), "PPP")
                              ) : (
                                <span>Pick a collection date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value + 'T00:00:00') : undefined}
                            onSelect={(date) => {
                              if (date) {
                                // Format date as YYYY-MM-DD in local timezone
                                const year = date.getFullYear();
                                const month = String(date.getMonth() + 1).padStart(2, '0');
                                const day = String(date.getDate()).padStart(2, '0');
                                const localDateString = `${year}-${month}-${day}`;
                                field.onChange(localDateString);
                              }
                            }}
                            disabled={(date) => {
                              // Disable past dates
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              if (date < today) return true;
                              
                              // Disable fully booked dates using consistent date formatting
                              const year = date.getFullYear();
                              const month = String(date.getMonth() + 1).padStart(2, '0');
                              const day = String(date.getDate()).padStart(2, '0');
                              const dateString = `${year}-${month}-${day}`;
                              return isFullyBooked(dateString);
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <p className="text-sm text-amber-600 mt-1">
                        Fully booked dates are grayed out and cannot be selected. Available for 2025 only. Blocked periods: Jul 12-20 & 25, entire August, various September/October/November dates, Dec 15-28 & 31
                      </p>
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
                          placeholder="Please specify: size, flavour, theme, colours, text, quantity, etc. For example: '6 inch vanilla sponge with chocolate buttercream, pink roses theme, Happy Birthday Sarah'. We also offer gluten-free options - please mention if required."
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
                          placeholder="Any allergies, dietary requirements, or special requests. Please see our allergen information page for full details."
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="referenceImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reference Image (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            field.onChange(file);
                          }}
                          className="cursor-pointer"
                        />
                      </FormControl>
                      <p className="text-sm text-gray-600 mt-1">
                        Upload a photo of a cake design you like for reference (optional)
                      </p>
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