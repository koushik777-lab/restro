import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Calendar as CalendarIcon, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useCities } from "@/hooks/use-cities";
import { cn } from "@/lib/utils";

export function BookingWidget() {
  const [location, setLocation] = useLocation();
  const [tripType, setTripType] = useState("oneway");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  
  const { data: cities } = useCities(undefined, true); // Fetch popular cities

  const handleSearch = () => {
    // Simple query param construction
    const params = new URLSearchParams({
      type: tripType,
      from: fromCity,
      to: toCity,
      date: date ? date.toISOString() : "",
    });
    setLocation(`/cars?${params.toString()}`);
  };

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-4xl mx-auto relative z-10 -mt-24 md:-mt-32 border border-gray-100"
    >
      <Tabs defaultValue="oneway" value={tripType} onValueChange={setTripType} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-muted/50 p-1 rounded-xl mb-6 h-auto">
          <TabsTrigger value="oneway" className="rounded-lg py-2.5 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm font-semibold">One Way</TabsTrigger>
          <TabsTrigger value="roundtrip" className="rounded-lg py-2.5 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm font-semibold">Round Trip</TabsTrigger>
          <TabsTrigger value="local" className="rounded-lg py-2.5 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm font-semibold">Local (Hourly)</TabsTrigger>
          <TabsTrigger value="airport" className="rounded-lg py-2.5 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm font-semibold">Airport</TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* FROM */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">From City</label>
            <Select onValueChange={setFromCity}>
              <SelectTrigger className="h-12 border-gray-200 bg-gray-50/50 focus:ring-primary/20 focus:border-primary">
                <div className="flex items-center gap-2 text-left">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <SelectValue placeholder="Select City" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {cities?.map(city => (
                  <SelectItem key={city.id} value={city.name}>{city.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* TO - only show if not local */}
          {tripType !== 'local' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">To City</label>
              <Select onValueChange={setToCity}>
                <SelectTrigger className="h-12 border-gray-200 bg-gray-50/50 focus:ring-primary/20 focus:border-primary">
                  <div className="flex items-center gap-2 text-left">
                    <MapPin className="w-4 h-4 text-secondary shrink-0" />
                    <SelectValue placeholder="Select City" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {cities?.map(city => (
                    <SelectItem key={city.id} value={city.name}>{city.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* DATE */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pick Up Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-12 justify-start text-left font-normal border-gray-200 bg-gray-50/50",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* TIME */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pick Up Time</label>
            <Select>
              <SelectTrigger className="h-12 border-gray-200 bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <SelectValue placeholder="10:00 AM" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="9am">09:00 AM</SelectItem>
                <SelectItem value="10am">10:00 AM</SelectItem>
                <SelectItem value="11am">11:00 AM</SelectItem>
                <SelectItem value="12pm">12:00 PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-8">
          <Button 
            onClick={handleSearch}
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary to-primary/90 hover:to-primary shadow-lg shadow-primary/30 rounded-xl"
          >
            Explore Cabs
          </Button>
        </div>
      </Tabs>
    </motion.div>
  );
}
