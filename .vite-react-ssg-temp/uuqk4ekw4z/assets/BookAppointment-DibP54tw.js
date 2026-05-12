import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { Helmet } from "react-helmet-async";
import { c as cn, b as buttonVariants, u as useToast, B as Button, N as Navbar, F as Footer } from "../main.mjs";
import * as React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Check, ArrowLeft, CalendarIcon, Loader2, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Link } from "react-router-dom";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent, e as CardFooter } from "./card-Uj2s_YfI.js";
import { I as Input } from "./input-6XZgwDxx.js";
import { L as Label } from "./label-DPO1kvhT.js";
import * as SelectPrimitive from "@radix-ui/react-select";
import { s as supabase } from "./client-CJtFN4ff.js";
import "vite-react-ssg";
import "@radix-ui/react-toast";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "next-themes";
import "sonner";
import "@radix-ui/react-tooltip";
import "@tanstack/react-query";
import "embla-carousel-react";
import "@radix-ui/react-slot";
import "@radix-ui/react-label";
import "@supabase/supabase-js";
function Calendar({ className, classNames, showOutsideDays = true, ...props }) {
  return /* @__PURE__ */ jsx(
    DayPicker,
    {
      showOutsideDays,
      className: cn("p-3", className),
      classNames: {
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(buttonVariants({ variant: "ghost" }), "h-9 w-9 p-0 font-normal aria-selected:opacity-100"),
        day_range_end: "day-range-end",
        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames
      },
      components: {
        IconLeft: ({ ..._props }) => /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" }),
        IconRight: ({ ..._props }) => /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })
      },
      ...props
    }
  );
}
Calendar.displayName = "Calendar";
const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverContent = React.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(PopoverPrimitive.Portal, { children: /* @__PURE__ */ jsx(
  PopoverPrimitive.Content,
  {
    ref,
    align,
    sideOffset,
    className: cn(
      "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
) }));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;
const Select = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;
const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
const SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollUpButton,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4" })
  }
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
const SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollDownButton,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" })
  }
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
const SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
  SelectPrimitive.Content,
  {
    ref,
    className: cn(
      "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: [
      /* @__PURE__ */ jsx(SelectScrollUpButton, {}),
      /* @__PURE__ */ jsx(
        SelectPrimitive.Viewport,
        {
          className: cn(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children
        }
      ),
      /* @__PURE__ */ jsx(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = SelectPrimitive.Content.displayName;
const SelectLabel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Label, { ref, className: cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className), ...props }));
SelectLabel.displayName = SelectPrimitive.Label.displayName;
const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })
    ]
  }
));
SelectItem.displayName = SelectPrimitive.Item.displayName;
const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Separator, { ref, className: cn("-mx-1 my-1 h-px bg-muted", className), ...props }));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
const carBrands = [
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Porsche",
  "Range Rover",
  "Jaguar",
  "Hyundai",
  "Maruti Suzuki",
  "Toyota",
  "Honda",
  "Tata",
  "Mahindra",
  "Kia",
  "MG",
  "Skoda",
  "Volkswagen",
  "Other"
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
  "Car Restoration"
];
const steps = [
  { id: "booking", title: "Booking Details" },
  { id: "confirmation", title: "Confirmation" }
];
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};
const contentVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -50, transition: { duration: 0.2 } }
};
const WHATSAPP_NUMBER = "917032674047";
const buildWhatsAppUrl = (form) => {
  const message = `Hi F9 Car Care, I'd like to book an appointment.

*Name:* ${form.name}
*Phone:* ${form.phone}
*Car:* ${form.brand} ${form.model}
*Service:* ${form.service}
*Date:* ${form.date}
*Time:* ${form.time}`;
  return `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
};
const openWhatsApp = (url) => {
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
    time: ""
  });
  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  const isStepValid = () => {
    if (currentStep === 0) {
      const phoneDigits = form.phone.replace(/^\+91/, "").replace(/\D/g, "");
      return form.name.trim().length >= 2 && phoneDigits.length === 10 && form.brand !== "" && form.model.trim() !== "" && form.service !== "" && form.date !== "" && form.time !== "";
    }
    return true;
  };
  const handleSubmit = async () => {
    setIsSubmitting(true);
    const { error } = await supabase.from("appointments").insert({
      name: form.name.trim(),
      phone: form.phone.trim(),
      service: `${form.service} — ${form.brand} ${form.model}`.trim(),
      preferred_date: form.date || null,
      preferred_time: form.time || null,
      message: `Brand: ${form.brand}, Model: ${form.model}`,
      source: "website-booking"
    });
    setIsSubmitting(false);
    if (error) {
      toast({
        title: "Could not save booking",
        description: error.message,
        variant: "destructive"
      });
      return;
    }
    setCurrentStep(1);
    toast({
      title: "Appointment Reserved! ✓",
      description: "Redirecting you to WhatsApp..."
    });
  };
  useEffect(() => {
    if (currentStep !== 1) return;
    setRedirectCountdown(3);
    const interval = setInterval(() => {
      setRedirectCountdown((c) => c > 0 ? c - 1 : 0);
    }, 1e3);
    const timeout = setTimeout(() => {
      openWhatsApp(buildWhatsAppUrl(form));
    }, 3e3);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [currentStep, form]);
  (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  return /* @__PURE__ */ jsx("section", { className: "section-padding bg-background min-h-[calc(100vh-5rem)]", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 },
        className: "mb-10",
        children: [
          /* @__PURE__ */ jsxs(
            Link,
            {
              to: "/",
              className: "inline-flex items-center gap-2 text-xs tracking-[0.12em] uppercase text-muted-foreground hover:text-foreground transition-colors mb-8",
              children: [
                /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }),
                "Back to Home"
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "luxury-divider mb-6" }),
            /* @__PURE__ */ jsx("h2", { className: "font-heading text-3xl md:text-5xl font-bold text-foreground mb-3 tracking-tight", children: "Book Your Car Service" }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-base md:text-lg max-w-md mx-auto", children: "Reserve in two simple steps. We'll connect on WhatsApp instantly." })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-3", children: steps.map((step, index) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center flex-1", children: [
        /* @__PURE__ */ jsx(
          motion.button,
          {
            type: "button",
            onClick: () => {
              if (index < currentStep) setCurrentStep(index);
            },
            whileTap: { scale: 0.95 },
            className: cn(
              "w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-medium transition-colors",
              index < currentStep ? "bg-primary border-primary text-primary-foreground" : index === currentStep ? "border-primary text-primary" : "border-border text-muted-foreground"
            ),
            children: index < currentStep ? /* @__PURE__ */ jsx(Check, { className: "w-4 h-4" }) : index + 1
          }
        ),
        /* @__PURE__ */ jsx(
          "span",
          {
            className: cn(
              "mt-2 text-xs tracking-wide uppercase",
              index === currentStep ? "text-foreground" : "text-muted-foreground"
            ),
            children: step.title
          }
        )
      ] }, step.id)) }),
      /* @__PURE__ */ jsx("div", { className: "h-1 w-full bg-secondary rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
        motion.div,
        {
          className: "h-full bg-primary",
          initial: { width: "0%" },
          animate: { width: `${(currentStep + 1) / steps.length * 100}%` },
          transition: { duration: 0.4 }
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxs(
        motion.div,
        {
          variants: contentVariants,
          initial: "hidden",
          animate: "visible",
          exit: "exit",
          children: [
            currentStep === 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs(CardHeader, { children: [
                /* @__PURE__ */ jsx(CardTitle, { children: "Booking Details" }),
                /* @__PURE__ */ jsx(CardDescription, { children: "Tell us about your car and the service you need." })
              ] }),
              /* @__PURE__ */ jsxs(CardContent, { className: "space-y-5", children: [
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: [
                  /* @__PURE__ */ jsxs(motion.div, { variants: fadeInUp, className: "space-y-2", children: [
                    /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Full Name" }),
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        id: "name",
                        placeholder: "Your name",
                        maxLength: 100,
                        value: form.name,
                        onChange: (e) => updateField("name", e.target.value)
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs(motion.div, { variants: fadeInUp, className: "space-y-2", children: [
                    /* @__PURE__ */ jsx(Label, { htmlFor: "phone", children: "Phone Number" }),
                    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                      /* @__PURE__ */ jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium select-none", children: "+91" }),
                      /* @__PURE__ */ jsx(
                        Input,
                        {
                          id: "phone",
                          type: "tel",
                          placeholder: "10-digit mobile number",
                          maxLength: 10,
                          className: "pl-12",
                          value: form.phone.replace(/^\+91/, ""),
                          onChange: (e) => {
                            const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                            updateField("phone", digits ? `+91${digits}` : "");
                          }
                        }
                      )
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: [
                  /* @__PURE__ */ jsxs(motion.div, { variants: fadeInUp, className: "space-y-2", children: [
                    /* @__PURE__ */ jsx(Label, { htmlFor: "brand", children: "Car Brand" }),
                    /* @__PURE__ */ jsxs(
                      Select,
                      {
                        value: form.brand,
                        onValueChange: (v) => updateField("brand", v),
                        children: [
                          /* @__PURE__ */ jsx(SelectTrigger, { id: "brand", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select brand" }) }),
                          /* @__PURE__ */ jsx(SelectContent, { position: "popper", side: "bottom", sideOffset: 4, avoidCollisions: false, children: carBrands.map((b) => /* @__PURE__ */ jsx(SelectItem, { value: b, children: b }, b)) })
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs(motion.div, { variants: fadeInUp, className: "space-y-2", children: [
                    /* @__PURE__ */ jsx(Label, { htmlFor: "model", children: "Car Model" }),
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        id: "model",
                        placeholder: "e.g. Creta, 3 Series",
                        maxLength: 50,
                        value: form.model,
                        onChange: (e) => updateField("model", e.target.value)
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxs(motion.div, { variants: fadeInUp, className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(Label, { htmlFor: "service", children: "Service" }),
                  /* @__PURE__ */ jsxs(
                    Select,
                    {
                      value: form.service,
                      onValueChange: (v) => updateField("service", v),
                      children: [
                        /* @__PURE__ */ jsx(SelectTrigger, { id: "service", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select a service" }) }),
                        /* @__PURE__ */ jsx(SelectContent, { position: "popper", side: "bottom", sideOffset: 4, avoidCollisions: false, children: serviceTypes.map((s) => /* @__PURE__ */ jsx(SelectItem, { value: s, children: s }, s)) })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: [
                  /* @__PURE__ */ jsxs(motion.div, { variants: fadeInUp, className: "space-y-2", children: [
                    /* @__PURE__ */ jsx(Label, { htmlFor: "date", children: "Preferred Date" }),
                    /* @__PURE__ */ jsxs(Popover, { children: [
                      /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
                        Button,
                        {
                          id: "date",
                          type: "button",
                          variant: "outline",
                          className: cn(
                            "w-full justify-start text-left font-normal",
                            !form.date && "text-muted-foreground"
                          ),
                          children: [
                            /* @__PURE__ */ jsx(CalendarIcon, { className: "mr-2 h-4 w-4" }),
                            form.date ? format(new Date(form.date), "PPP") : /* @__PURE__ */ jsx("span", { children: "Pick a date" })
                          ]
                        }
                      ) }),
                      /* @__PURE__ */ jsx(PopoverContent, { className: "w-auto p-0", align: "start", children: /* @__PURE__ */ jsx(
                        Calendar,
                        {
                          mode: "single",
                          selected: form.date ? new Date(form.date) : void 0,
                          onSelect: (d) => updateField("date", d ? format(d, "yyyy-MM-dd") : ""),
                          disabled: (d) => {
                            const t = /* @__PURE__ */ new Date();
                            t.setHours(0, 0, 0, 0);
                            return d < t;
                          },
                          initialFocus: true,
                          className: cn("p-3 pointer-events-auto")
                        }
                      ) })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs(motion.div, { variants: fadeInUp, className: "space-y-2", children: [
                    /* @__PURE__ */ jsx(Label, { htmlFor: "time", children: "Preferred Time" }),
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        id: "time",
                        type: "time",
                        value: form.time,
                        onChange: (e) => updateField("time", e.target.value)
                      }
                    )
                  ] })
                ] })
              ] })
            ] }),
            currentStep === 1 && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs(CardHeader, { children: [
                /* @__PURE__ */ jsx(CardTitle, { children: "Appointment Reserved" }),
                /* @__PURE__ */ jsxs(CardDescription, { children: [
                  "Redirecting you to WhatsApp to finalize with our team",
                  redirectCountdown > 0 ? ` in ${redirectCountdown}s...` : "..."
                ] })
              ] }),
              /* @__PURE__ */ jsxs(CardContent, { className: "space-y-6", children: [
                /* @__PURE__ */ jsx(
                  motion.div,
                  {
                    initial: { scale: 0 },
                    animate: { scale: 1 },
                    transition: { type: "spring", stiffness: 200, delay: 0.1 },
                    className: "flex justify-center",
                    children: /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsx(Check, { className: "w-8 h-8 text-primary" }) })
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-secondary/40 p-5 space-y-2 text-sm", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between gap-4", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Name" }),
                    /* @__PURE__ */ jsx("span", { className: "text-foreground font-medium", children: form.name })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between gap-4", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Phone" }),
                    /* @__PURE__ */ jsx("span", { className: "text-foreground font-medium", children: form.phone })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between gap-4", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Car" }),
                    /* @__PURE__ */ jsxs("span", { className: "text-foreground font-medium", children: [
                      form.brand,
                      " ",
                      form.model
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between gap-4", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Service" }),
                    /* @__PURE__ */ jsx("span", { className: "text-foreground font-medium", children: form.service })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between gap-4", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "When" }),
                    /* @__PURE__ */ jsxs("span", { className: "text-foreground font-medium", children: [
                      form.date,
                      " · ",
                      form.time
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-sm text-muted-foreground", children: [
                  /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }),
                  "Opening WhatsApp..."
                ] }),
                /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: buildWhatsAppUrl(form),
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors",
                    children: [
                      /* @__PURE__ */ jsx(MessageCircle, { className: "w-4 h-4" }),
                      "Tap here if WhatsApp didn't open"
                    ]
                  }
                ) })
              ] })
            ] })
          ]
        },
        currentStep
      ) }),
      currentStep === 0 && /* @__PURE__ */ jsxs(CardFooter, { className: "flex justify-between pt-2 pb-6", children: [
        /* @__PURE__ */ jsxs(Button, { type: "button", variant: "outline", disabled: true, className: "gap-1", children: [
          /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" }),
          " Back"
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            onClick: handleSubmit,
            disabled: !isStepValid() || isSubmitting,
            className: "gap-1",
            children: isSubmitting ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
              " Reserving..."
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              "Confirm Booking ",
              /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })
            ] })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "mt-4 text-center text-sm text-muted-foreground",
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.5, delay: 0.2 },
        children: [
          "Step ",
          currentStep + 1,
          " of ",
          steps.length,
          ": ",
          steps[currentStep].title
        ]
      }
    )
  ] }) });
};
const BookAppointment = () => {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "Contact F9 Car Care | Book Car Detailing in Hafeezpet, Hyderabad" }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: "Get in touch with F9 Car Care in Hafeezpet, Hyderabad. Call, WhatsApp, or fill the form to book ceramic coating, PPF, or any detailing service." }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: "https://www.f9carcare.co.in/contact" }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: "Contact F9 Car Care | Book a Slot" }),
      /* @__PURE__ */ jsx("meta", { property: "og:description", content: "Book ceramic coating, PPF, or car wash in Hafeezpet, Hyderabad." }),
      /* @__PURE__ */ jsx("meta", { property: "og:url", content: "https://www.f9carcare.co.in/contact" }),
      /* @__PURE__ */ jsx("meta", { property: "og:type", content: "website" })
    ] }),
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("div", { className: "pt-20", children: /* @__PURE__ */ jsx(BookingForm, {}) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
export {
  BookAppointment as default
};
