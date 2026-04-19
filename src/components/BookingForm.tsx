import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, Loader2, ArrowLeft, MessageCircle, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const carBrands = [
  "BMW", "Mercedes-Benz", "Audi", "Porsche", "Range Rover", "Jaguar",
  "Hyundai", "Maruti Suzuki", "Toyota", "Honda", "Tata", "Mahindra",
  "Kia", "MG", "Skoda", "Volkswagen", "Other",
];

const serviceTypes = [
  "Deep Interior Wash",
  "Teflon Coating",
  "Nano Coating",
  "Ceramic Coating",
  "PPF (Paint Protection Film)",
  "Sun Film",
  "Car Seat Covers",
  "Car Floor Matting",
  "Car Denting",
  "Car Painting",
  "Car Restoration",
];

const steps = [
  { id: "booking", title: "Booking Details" },
  { id: "confirmation", title: "Confirmation" },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const contentVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -50, transition: { duration: 0.2 } },
};

const WHATSAPP_NUMBER = "917032674047";

const buildWhatsAppUrl = (form: {
  name: string;
  phone: string;
  brand: string;
  model: string;
  service: string;
  date: string;
  time: string;
}) => {
  const message =
    `Hi F9 Car Care, I'd like to book an appointment.\n\n` +
    `*Name:* ${form.name}\n` +
    `*Phone:* ${form.phone}\n` +
    `*Car:* ${form.brand} ${form.model}\n` +
    `*Service:* ${form.service}\n` +
    `*Date:* ${form.date}\n` +
    `*Time:* ${form.time}`;
  return `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
};

const openWhatsApp = (url: string) => {
  // Break out of the preview iframe so WhatsApp doesn't get blocked by X-Frame-Options
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const BookingForm = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(3);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    brand: "",
    model: "",
    service: "",
    date: "",
    time: "",
  });

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isStepValid = () => {
    if (currentStep === 0) {
      const phoneClean = form.phone.replace(/\D/g, "");
      return (
        form.name.trim().length >= 2 &&
        phoneClean.length >= 10 &&
        form.brand !== "" &&
        form.model.trim() !== "" &&
        form.service !== "" &&
        form.date !== "" &&
        form.time !== ""
      );
    }
    return true;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsSubmitting(false);
    setCurrentStep(1);
    toast({
      title: "Appointment Reserved! ✓",
      description: "Redirecting you to WhatsApp...",
    });
  };

  // Auto-redirect to WhatsApp once on confirmation step
  useEffect(() => {
    if (currentStep !== 1) return;
    setRedirectCountdown(3);
    const interval = setInterval(() => {
      setRedirectCountdown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    const timeout = setTimeout(() => {
      window.open(buildWhatsAppUrl(form), "_blank", "noopener,noreferrer");
    }, 3000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [currentStep, form]);

  const today = new Date().toISOString().split("T")[0];

  return (
    <section className="section-padding bg-background min-h-[calc(100vh-5rem)]">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs tracking-[0.12em] uppercase text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="text-center">
            <div className="luxury-divider mb-6" />
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-3 tracking-tight">
              Book Your Car Service
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto">
              Reserve in two simple steps. We'll connect on WhatsApp instantly.
            </p>
          </div>
        </motion.div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <motion.button
                  type="button"
                  onClick={() => {
                    if (index < currentStep) setCurrentStep(index);
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-medium transition-colors",
                    index < currentStep
                      ? "bg-primary border-primary text-primary-foreground"
                      : index === currentStep
                      ? "border-primary text-primary"
                      : "border-border text-muted-foreground",
                  )}
                >
                  {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                </motion.button>
                <span
                  className={cn(
                    "mt-2 text-xs tracking-wide uppercase",
                    index === currentStep ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>
          <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        <Card>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {currentStep === 0 && (
                <>
                  <CardHeader>
                    <CardTitle>Booking Details</CardTitle>
                    <CardDescription>
                      Tell us about your car and the service you need.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          placeholder="Your name"
                          maxLength={100}
                          value={form.name}
                          onChange={(e) => updateField("name", e.target.value)}
                        />
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="10-digit mobile number"
                          maxLength={15}
                          value={form.phone}
                          onChange={(e) => updateField("phone", e.target.value)}
                        />
                      </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="brand">Car Brand</Label>
                        <Select
                          value={form.brand}
                          onValueChange={(v) => updateField("brand", v)}
                        >
                          <SelectTrigger id="brand">
                            <SelectValue placeholder="Select brand" />
                          </SelectTrigger>
                          <SelectContent position="popper" side="bottom" sideOffset={4} avoidCollisions={false}>
                            {carBrands.map((b) => (
                              <SelectItem key={b} value={b}>
                                {b}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="model">Car Model</Label>
                        <Input
                          id="model"
                          placeholder="e.g. Creta, 3 Series"
                          maxLength={50}
                          value={form.model}
                          onChange={(e) => updateField("model", e.target.value)}
                        />
                      </motion.div>
                    </div>

                    <motion.div variants={fadeInUp} className="space-y-2">
                      <Label htmlFor="service">Service</Label>
                      <Select
                        value={form.service}
                        onValueChange={(v) => updateField("service", v)}
                      >
                        <SelectTrigger id="service">
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent position="popper" side="bottom" sideOffset={4} avoidCollisions={false}>
                          {serviceTypes.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="date">Preferred Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="date"
                              type="button"
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !form.date && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {form.date ? format(new Date(form.date), "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={form.date ? new Date(form.date) : undefined}
                              onSelect={(d) =>
                                updateField("date", d ? format(d, "yyyy-MM-dd") : "")
                              }
                              disabled={(d) => {
                                const t = new Date();
                                t.setHours(0, 0, 0, 0);
                                return d < t;
                              }}
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="time">Preferred Time</Label>
                        <Input
                          id="time"
                          type="time"
                          value={form.time}
                          onChange={(e) => updateField("time", e.target.value)}
                        />
                      </motion.div>
                    </div>
                  </CardContent>
                </>
              )}

              {currentStep === 1 && (
                <>
                  <CardHeader>
                    <CardTitle>Appointment Reserved</CardTitle>
                    <CardDescription>
                      Redirecting you to WhatsApp to finalize with our team
                      {redirectCountdown > 0 ? ` in ${redirectCountdown}s...` : "..."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                      className="flex justify-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check className="w-8 h-8 text-primary" />
                      </div>
                    </motion.div>

                    <div className="rounded-lg border border-border bg-secondary/40 p-5 space-y-2 text-sm">
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Name</span>
                        <span className="text-foreground font-medium">{form.name}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Phone</span>
                        <span className="text-foreground font-medium">{form.phone}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Car</span>
                        <span className="text-foreground font-medium">
                          {form.brand} {form.model}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Service</span>
                        <span className="text-foreground font-medium">{form.service}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">When</span>
                        <span className="text-foreground font-medium">
                          {form.date} · {form.time}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Opening WhatsApp...
                    </div>

                    <div className="text-center">
                      <a
                        href={buildWhatsAppUrl(form)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Tap here if WhatsApp didn't open
                      </a>
                    </div>
                  </CardContent>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {currentStep === 0 && (
            <CardFooter className="flex justify-between pt-2 pb-6">
              <Button type="button" variant="outline" disabled className="gap-1">
                <ChevronLeft className="h-4 w-4" /> Back
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={!isStepValid() || isSubmitting}
                className="gap-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Reserving...
                  </>
                ) : (
                  <>
                    Confirm Booking <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          )}
        </Card>

        <motion.div
          className="mt-4 text-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
        </motion.div>
      </div>
    </section>
  );
};

export default BookingForm;
