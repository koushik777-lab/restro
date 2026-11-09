import { useLocation } from "wouter";
import { useCars } from "@/hooks/use-cars";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Users, Fuel, Briefcase, Star, Info } from "lucide-react";
import { motion } from "framer-motion";

export default function CarListing() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const type = searchParams.get("type") || "oneway";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  
  const { data: cars, isLoading } = useCars();

  const handleSelectCar = (carId: number) => {
    setLocation(`/booking/${carId}/confirm?${searchParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      
      <div className="bg-gray-900 py-12 text-center">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white">Select Your Car</h1>
        <p className="text-gray-400 mt-2">
          {from} {to && `to ${to}`} • {type === 'oneway' ? 'One Way' : 'Round Trip'}
        </p>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="space-y-4">
             {[1,2,3].map(i => <div key={i} className="h-48 bg-white rounded-3xl animate-pulse" />)}
          </div>
        ) : (
          <div className="space-y-6">
            {cars?.map((car, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all flex flex-col md:flex-row gap-8 items-center"
              >
                {/* Car Image */}
                <div className="w-full md:w-1/3 aspect-[16/9] bg-gray-50 rounded-2xl overflow-hidden relative">
                   {/* Using dynamic unsplash image if db image is not valid url, but relying on component logic */}
                   <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
                   <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-foreground flex items-center gap-1">
                     <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {car.rating}
                   </div>
                </div>

                {/* Details */}
                <div className="flex-1 w-full text-center md:text-left">
                  <h3 className="text-2xl font-bold font-display text-foreground">{car.name}</h3>
                  <div className="text-gray-500 font-medium mb-4">{car.type}</div>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                      <Users className="w-4 h-4 text-primary" />
                      {car.capacity} Seats
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                      <Fuel className="w-4 h-4 text-primary" />
                      {car.ac ? 'AC' : 'Non-AC'}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                      <Briefcase className="w-4 h-4 text-primary" />
                      2 Bags
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                       <Info className="w-4 h-4" /> Extra km fare: ₹{car.pricePerKm}/km
                    </div>
                    <div className="flex items-center gap-1">
                       <Info className="w-4 h-4" /> Toll & parking extra
                    </div>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="w-full md:w-auto text-center md:text-right flex flex-col items-center md:items-end gap-2 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
                  <div className="text-gray-500 text-sm line-through">₹{car.pricePerKm * 1.5}/km</div>
                  <div className="text-3xl font-bold text-primary">₹{car.pricePerKm}<span className="text-sm text-gray-500 font-normal">/km</span></div>
                  <p className="text-xs text-gray-400 mb-4">Excludes GST</p>
                  
                  <Button 
                    onClick={() => handleSelectCar(car.id)}
                    className="w-full md:w-40 bg-foreground text-white hover:bg-foreground/90 rounded-xl"
                  >
                    Select Car
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
