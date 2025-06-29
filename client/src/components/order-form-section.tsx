import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  cakeType: z.string().min(1, "Cake type is required"),
  cakeSize: z.string().min(1, "Cake size is required"),
  cakeFlavour: z.string().optional(),
  cakeTheme: z.string().optional(),
  specialRequirements: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

const cakeTypes = [
  { value: "wedding", label: "Wedding Cake (from £350)", basePrice: 350 },
  { value: "birthday", label: "Birthday Cake (from £85)", basePrice: 85 },
  { value: "anniversary", label: "Anniversary Cake (from £125)", basePrice: 125 },
  { value: "celebration", label: "Celebration Cake (from £95)", basePrice: 95 },
  { value: "cupcakes", label: "Cupcakes - Dozen (£42)", basePrice: 42 },
  { value: "custom", label: "Custom Design (from £120)", basePrice: 120 },
];

const cakeSizes = [
  { value: "small", label: "Small (12-15 people)", multiplier: 1 },
  { value: "medium", label: "Medium (20-25 people)", multiplier: 1.3 },
  { value: "large", label: "Large (35-40 people)", multiplier: 1.6 },
  { value: "extra-large", label: "Extra Large (50+ people)", multiplier: 2 },
];

const flavours = [
  { value: "vanilla", label: "Classic Vanilla", surcharge: 0 },
  { value: "chocolate", label: "Rich Chocolate", surcharge: 0 },
  { value: "lemon", label: "Zesty Lemon", surcharge: 0 },
  { value: "red-velvet", label: "Red Velvet", surcharge: 0 },
  { value: "carrot", label: "Carrot Cake", surcharge: 0 },
  { value: "champagne", label: "Champagne (Premium +£25)", surcharge: 25 },
  { value: "custom", label: "Custom Flavour", surcharge: 0 },
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
      // Confirm payment on backend
      try {
        await apiRequest("POST", "/api/confirm-payment", {
          paymentIntentId: stripe,
          orderId: orderId
        });
        
        toast({
          title: "Payment Successful",
          description: "Thank you! Your deposit has been processed.",
        });
        
        onSuccess();
      } catch (confirmError) {
        console.error('Payment confirmation error:', confirmError);
      }
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || processing}
        className="w-full bg-charcoal hover:bg-charcoal/90 text-white"
      >
        {processing ? "Processing..." : `Pay Deposit £${amount.toFixed(2)}`}
      </Button>
    </form>
  );
}

export default function OrderFormSection() {
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [depositAmount, setDepositAmount] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [currentOrderId, setCurrentOrderId] = useState<number | null>(null);
  const { toast } = useToast();

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      collectionDate: "",
      cakeType: "",
      cakeSize: "",
      cakeFlavour: "",
      cakeTheme: "",
      specialRequirements: "",
    },
  });

  const watchedValues = form.watch(['cakeType', 'cakeSize', 'cakeFlavour']);

  useEffect(() => {
    const calculatePrice = () => {
      const [cakeType, cakeSize, cakeFlavour] = watchedValues;
      
      if (!cakeType || !cakeSize) {
        setEstimatedPrice(0);
        setDepositAmount(0);
        return;
      }

      const selectedCake = cakeTypes.find(c => c.value === cakeType);
      const selectedSize = cakeSizes.find(s => s.value === cakeSize);
      const selectedFlavour = flavours.find(f => f.value === cakeFlavour);

      if (selectedCake && selectedSize) {
        const basePrice = selectedCake.basePrice;
        const sizeMultiplier = selectedSize.multiplier;
        const flavourSurcharge = selectedFlavour?.surcharge || 0;

        const totalPrice = (basePrice * sizeMultiplier) + flavourSurcharge;
        const deposit = totalPrice * 0.2;

        setEstimatedPrice(totalPrice);
        setDepositAmount(deposit);
      }
    };

    calculatePrice();
  }, [watchedValues]);

  // Set minimum date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const onSubmit = async (data: OrderFormData) => {
    try {
      const orderData = {
        ...data,
        estimatedPrice: estimatedPrice.toString(),
        depositAmount: depositAmount.toString(),
      };

      const response = await apiRequest("POST", "/api/orders", orderData);
      const order = await response.json();
      
      setCurrentOrderId(order.id);
      
      toast({
        title: "Order Submitted",
        description: "Your order has been submitted successfully! Redirecting to payment...",
      });

      // Automatically proceed to payment
      if (depositAmount > 0) {
        setCurrentOrderId(order.id);
        setTimeout(() => handlePayDeposit(), 1000);
      }
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to submit order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePayDeposit = async (orderId?: number) => {
    const orderIdToUse = orderId || currentOrderId;
    
    if (!orderIdToUse || depositAmount === 0) {
      toast({
        title: "Error",
        description: "Please submit your order first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await apiRequest("POST", "/api/create-payment-intent", {
        amount: depositAmount,
        orderId: orderIdToUse
      });
      
      const { clientSecret } = await response.json();
      setClientSecret(clientSecret);
      setShowPayment(true);
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <section id="order" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl font-bold text-charcoal mb-4">
            Order Your <span className="text-gold">Perfect Cake</span>
          </h2>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            Tell us about your dream cake and we'll create something truly special for your celebration.
          </p>
        </div>
        
        <Card className="bg-gray-50 shadow-lg">
          <CardContent className="p-8">
            {!showPayment ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="customerEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="customerPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input type="tel" {...field} />
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
                          <FormLabel>Collection Date *</FormLabel>
                          <FormControl>
                            <Input type="date" min={minDate} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="cakeType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cake Type *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select cake type..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {cakeTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
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
                      name="cakeSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Size/Servings *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select size..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {cakeSizes.map((size) => (
                                <SelectItem key={size.value} value={size.value}>
                                  {size.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="cakeFlavour"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Flavour Preference</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select flavour..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {flavours.map((flavour) => (
                                <SelectItem key={flavour.value} value={flavour.value}>
                                  {flavour.label}
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
                      name="cakeTheme"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Theme/Style</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Floral, Modern, Vintage, Disney..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="specialRequirements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Requirements / Additional Details</FormLabel>
                        <FormControl>
                          <Textarea 
                            rows={4}
                            placeholder="Tell us about any dietary requirements, specific decorations, colours, or any other special requests..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Card className="bg-gold/10 border-gold/20">
                    <CardContent className="p-6">
                      <h3 className="font-serif text-xl font-bold text-charcoal mb-2">Estimated Price</h3>
                      <div className="flex justify-between items-center">
                        <span className="text-lg">Total Estimate:</span>
                        <span className="text-2xl font-bold text-gold">£{estimatedPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-600">Deposit Required (20%):</span>
                        <span className="text-lg font-semibold text-gold">£{depositAmount.toFixed(2)}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">*Final price will be confirmed after consultation</p>
                    </CardContent>
                  </Card>

                  <Button 
                    type="submit" 
                    className="w-full bg-gold hover:bg-gold-dark text-black font-semibold text-lg py-3"
                    disabled={estimatedPrice === 0}
                  >
                    Submit Order & Pay Deposit (£{depositAmount.toFixed(2)})
                  </Button>
                </form>
              </Form>
            ) : (
              <div>
                <h3 className="font-serif text-2xl font-bold text-charcoal mb-6 text-center">
                  Pay Your Deposit
                </h3>
                {clientSecret && stripePromise && (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <PaymentForm 
                      orderId={currentOrderId!}
                      amount={depositAmount}
                      onSuccess={() => setShowPayment(false)}
                    />
                  </Elements>
                )}
                <Button 
                  onClick={() => {
                    setShowPayment(false);
                    setCurrentOrderId(null);
                    form.reset();
                    setEstimatedPrice(0);
                    setDepositAmount(0);
                  }}
                  variant="outline"
                  className="w-full mt-4"
                >
                  Back to Order Form
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
