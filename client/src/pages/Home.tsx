import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { ShieldCheck, Receipt, UserCheck, Smartphone, ChevronRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BookingWidget } from "@/components/BookingWidget";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

// Stock images from Unsplash
const HERO_IMAGE = "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2940&auto=format&fit=crop"; 
// Scenic road
const APP_IMAGE = "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1000&auto=format&fit=crop"; 
// Phone mockup style

export default function Home() {
  const featureRef = useRef(null);
  const fleetRef = useRef(null);

  useEffect(() => {
    // GSAP Scroll Animations
    const ctx = gsap.context(() => {
      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: featureRef.current,
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
      });
      
      gsap.from(".fleet-card", {
        scrollTrigger: {
          trigger: fleetRef.current,
          start: "top 80%",
        },
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
      });
    });
    
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center bg-gray-900 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 via-transparent to-background/90" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto -mt-20">
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight"
          >
            Your Journey, <span className="text-primary">Our Passion.</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto"
          >
            Premium car rentals for outstation, local, and airport transfers. Experience the comfort of luxury travel at affordable rates.
          </motion.p>
        </div>
      </section>

      {/* Booking Widget Wrapper - floats over hero and content */}
      <div className="relative px-4 sm:px-6">
        <BookingWidget />
      </div>

      {/* Features Section */}
      <section ref={featureRef} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-foreground">Why Choose Journey?</h2>
            <div className="w-20 h-1.5 bg-primary mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="feature-card text-center p-8 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-secondary">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Clean & Safe Cars</h3>
              <p className="text-gray-500 leading-relaxed">Every car is sanitized before and after every trip to ensure your safety and hygiene.</p>
            </div>

            <div className="feature-card text-center p-8 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100">
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
                <Receipt className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Transparent Billing</h3>
              <p className="text-gray-500 leading-relaxed">No hidden charges. What you see is what you pay. GST and toll charges explained clearly.</p>
            </div>

            <div className="feature-card text-center p-8 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-green-600">
                <UserCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Expert Chauffeurs</h3>
              <p className="text-gray-500 leading-relaxed">Professional, polite, and verified drivers who know the routes and respect your time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Showcase */}
      <section id="services" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-display font-bold text-foreground">Our Services</h2>
              <p className="text-gray-500 mt-2">Tailored travel solutions for every need</p>
            </div>
            <Button variant="ghost" className="text-primary hover:text-primary/80 group">
              View All Services <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             {/* Unsplash: Road trip */}
            <div className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer">
              <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80" alt="Round Trip" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end">
                <h3 className="text-white text-xl font-bold">Round Trip</h3>
                <p className="text-gray-300 text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">Perfect for weekend getaways.</p>
              </div>
            </div>

            {/* Unsplash: Highway */}
            <div className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer">
              <img src="https://images.unsplash.com/photo-1476900543704-4312b78632f8?w=800&q=80" alt="One Way" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end">
                <h3 className="text-white text-xl font-bold">One Way Drops</h3>
                <p className="text-gray-300 text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">Pay only for one way.</p>
              </div>
            </div>

            {/* Unsplash: City traffic */}
            <div className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer">
              <img src="https://images.unsplash.com/photo-1449824913929-49aa714953dc?w=800&q=80" alt="Local Rentals" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end">
                <h3 className="text-white text-xl font-bold">Local Rentals</h3>
                <p className="text-gray-300 text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">Full day city travel.</p>
              </div>
            </div>

            {/* Unsplash: Airport */}
            <div className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer">
              <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80" alt="Airport Transfer" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end">
                <h3 className="text-white text-xl font-bold">Airport Transfer</h3>
                <p className="text-gray-300 text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">On time, every time.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fleet Showcase - Simplified */}
      <section id="fleet" ref={fleetRef} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-foreground">Our Premium Fleet</h2>
            <p className="text-gray-500 mt-2">Choose the best car for your journey</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['Hatchback', 'Sedan', 'SUV'].map((type, i) => (
              <div key={type} className="fleet-card bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="aspect-[4/3] bg-gray-100 rounded-2xl mb-6 flex items-center justify-center overflow-hidden">
                   {/* Placeholder car images */}
                   <img 
                    src={`https://images.unsplash.com/photo-${i === 0 ? '1549317661-bd32c8ce0db2' : i === 1 ? '1542362567-b07e54358753' : '1533473359331-0135ef1b58bf'}?w=500&q=80`} 
                    alt={type} 
                    className="w-full h-full object-cover"
                   />
                </div>
                <h3 className="text-xl font-bold mb-2">{type}</h3>
                <p className="text-gray-500 text-sm mb-4">Starting from ₹{i === 0 ? '9' : i === 1 ? '11' : '14'}/km</p>
                <Button variant="outline" className="w-full rounded-xl border-gray-200 hover:bg-gray-50 hover:text-primary">View Details</Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile App CTA */}
      <section className="bg-foreground py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">Download the Journey App</h2>
              <p className="text-gray-400 text-lg mb-8 max-w-xl">
                Get exclusive offers, track your ride in real-time, and manage bookings easily. Available for iOS and Android.
              </p>
              <div className="flex gap-4 justify-center md:justify-start">
                <Button size="lg" className="bg-white text-foreground hover:bg-gray-100">
                  <Smartphone className="w-5 h-5 mr-2" />
                  App Store
                </Button>
                <Button size="lg" className="bg-transparent border border-white text-white hover:bg-white/10">
                  <Smartphone className="w-5 h-5 mr-2" />
                  Play Store
                </Button>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl" />
              <img 
                src={APP_IMAGE} 
                alt="Mobile App" 
                className="relative z-10 w-full max-w-xs mx-auto rounded-3xl shadow-2xl border-4 border-gray-800 rotate-[-5deg] hover:rotate-0 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
