import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Contact() {
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      toast({ title: "Please fill name and message", variant: "destructive" });
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("contact_submissions").insert({
      name: form.name.trim(),
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      message: form.message.trim(),
    });
    setBusy(false);
    if (error) {
      toast({ title: "Could not send", description: error.message, variant: "destructive" });
      return;
    }
    setDone(true);
    toast({ title: "Message sent ✓", description: "We'll get back to you shortly." });
  };

  return (
    <>
      <Helmet>
        <title>Contact F9 Car Care | Hyderabad</title>
        <meta name="description" content="Send F9 Car Care a message. We respond on WhatsApp, email, or phone." />
        <link rel="canonical" href="https://www.f9carcare.co.in/contact" />
      </Helmet>
      <Navbar />
      <section className="pt-28 pb-16 section-padding bg-background min-h-[80vh]">
        <div className="max-w-2xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-xs tracking-[0.12em] uppercase text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="text-center mb-8">
            <div className="luxury-divider mb-6" />
            <h1 className="font-heading text-3xl md:text-5xl font-bold mb-3 tracking-tight">Get in touch</h1>
            <p className="text-muted-foreground">Tell us what your car needs. We'll reply soon.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Send a message</CardTitle>
              <CardDescription>We typically respond within a few hours.</CardDescription>
            </CardHeader>
            <CardContent>
              {done ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Send className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-medium mb-1">Thanks {form.name.split(" ")[0]}!</p>
                  <p className="text-sm text-muted-foreground">Our team will reach out shortly.</p>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input id="name" maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium select-none">
                          +91
                        </span>
                        <Input 
                          id="phone" 
                          type="tel" 
                          maxLength={10}
                          className="pl-12"
                          value={form.phone.replace(/^\+91/, "")} 
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                            setForm({ ...form, phone: digits ? `+91${digits}` : "" });
                          }} 
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" maxLength={255} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea id="message" rows={5} maxLength={1000} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
                  </div>
                  <Button type="submit" className="w-full" disabled={busy}>
                    {busy && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    Send message
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
      <Footer />
    </>
  );
}
