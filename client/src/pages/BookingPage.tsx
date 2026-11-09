import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useCar } from "@/hooks/use-cars";
import { useCreateBooking } from "@/hooks/use-bookings";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function BookingPage() {
  const [match, params] = useRoute("/booking/:carId/confirm");
  const carId = params ? parseInt(params.carId) : 0;
  const { data: car, isLoading: carLoading } = useCar(carId);
  
  const searchParams = new URLSearchParams(window.location.search);
  const tripType = searchParams.get("type") || "oneway";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const dateStr = searchParams.get("date");
  const date = dateStr ? new Date(dateStr) : new Date();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const { toast } = useToast();
  const createBooking = useCreateBooking();
  const [isSuccess, setIsSuccess] = useState(false);
  const [location, setLocation] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      toast({ title: "Error", description: "Name and Phone are required", variant: "destructive" });
      return;
    }

    createBooking.mutate({
      carId,
      customerName: formData.name,
      customerPhone: formData.phone,
      customerEmail: formData.email,
      tripType,
      pickupLocation: from,
      dropLocation: to,
      pickupDate: date,
      pickupTime: "10:00 AM", // Default for now
    }, {
      onSuccess: () => {
        setIsSuccess(true);
        window.scrollTo(0,0);
      },
      onError: (err) => {
        toast({ title: "Booking Failed", description: err.message, variant: "destructive" });
      }
    });
  };

  if (carLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  if (!car) return <div className="min-h-screen flex items-center justify-center">Car not found</div>;

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white max-w-md w-full p-8 rounded-3xl shadow-xl text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-4">Booking Confirmed!</h1>
          <p className="text-gray-500 mb-8">
            Thank you, {formData.name}. Your booking for {car.name} from {from} to {to} has been received. Our team will contact you shortly.
          </p>
          <Button onClick={() => setLocation("/")} className="w-full rounded-xl bg-primary hover:bg-primary/90">
            Back to Home
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button 
          variant="ghost" 
          onClick={() => window.history.back()} 
          className="mb-8 hover:bg-transparent hover:text-primary pl-0"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to cars
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card className="p-8 rounded-3xl border-gray-100 shadow-lg">
              <h2 className="text-2xl font-bold font-display mb-6">Passenger Details</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      placeholder="John Doe" 
                      className="rounded-xl h-12"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      placeholder="+91 99999 99999" 
                      className="rounded-xl h-12"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address (Optional)</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="john@example.com" 
                    className="rounded-xl h-12"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div className="pt-6">
                  <Button 
                    type="submit" 
                    className="w-full h-14 text-lg font-bold rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
                    disabled={createBooking.isPending}
                  >
                    {createBooking.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Confirming...
                      </>
                    ) : (
                      "Confirm Booking"
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg sticky top-24">
              <h3 className="text-lg font-bold font-display mb-4">Booking Summary</h3>
              
              <div className="aspect-video bg-gray-50 rounded-xl mb-4 overflow-hidden">
                <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between font-bold text-lg text-foreground">
                  <span>{car.name}</span>
                  <span>{car.type}</span>
                </div>
                
                <div className="border-t border-dashed border-gray-200 my-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-500">
                    <span>From</span>
                    <span className="font-medium text-foreground">{from}</span>
                  </div>
                  {to && (
                    <div className="flex justify-between text-gray-500">
                      <span>To</span>
                      <span className="font-medium text-foreground">{to}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-500">
                    <span>Date</span>
                    <span className="font-medium text-foreground">{date.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Trip Type</span>
                    <span className="font-medium text-foreground capitalize">{tripType}</span>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl text-secondary text-xs mt-4">
                  <p className="font-semibold mb-1">Fare includes:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Driver Allowance</li>
                    <li>Fuel Charges</li>
                    <li>Clean & Sanitized Car</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
