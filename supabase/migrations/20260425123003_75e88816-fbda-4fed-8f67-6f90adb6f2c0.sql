-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE public.app_role AS ENUM ('admin', 'staff', 'user');
CREATE TYPE public.appointment_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
CREATE TYPE public.contact_status AS ENUM ('new', 'in_progress', 'resolved');
CREATE TYPE public.wa_direction AS ENUM ('in', 'out');
CREATE TYPE public.wa_status AS ENUM ('sent', 'delivered', 'read', 'failed', 'received');
CREATE TYPE public.lead_type AS ENUM ('appointment', 'contact');

-- ============================================================
-- updated_at trigger function
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================================
-- USER ROLES
-- ============================================================
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- SECURITY DEFINER role check — prevents RLS recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Convenience: is the user admin OR staff?
CREATE OR REPLACE FUNCTION public.is_admin_or_staff(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin', 'staff')
  )
$$;

-- user_roles policies
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
  ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles"
  ON public.user_roles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
  ON public.user_roles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- APPOINTMENTS
-- ============================================================
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  service TEXT,
  doctor TEXT,
  preferred_date DATE,
  preferred_time TEXT,
  message TEXT,
  source TEXT DEFAULT 'website',
  status public.appointment_status NOT NULL DEFAULT 'pending',
  staff_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit appointments"
  ON public.appointments FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin/staff can view appointments"
  ON public.appointments FOR SELECT TO authenticated
  USING (public.is_admin_or_staff(auth.uid()));

CREATE POLICY "Admin/staff can update appointments"
  ON public.appointments FOR UPDATE TO authenticated
  USING (public.is_admin_or_staff(auth.uid()));

CREATE POLICY "Admin/staff can delete appointments"
  ON public.appointments FOR DELETE TO authenticated
  USING (public.is_admin_or_staff(auth.uid()));

CREATE TRIGGER set_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_appointments_phone ON public.appointments(phone);
CREATE INDEX idx_appointments_status ON public.appointments(status);
CREATE INDEX idx_appointments_created ON public.appointments(created_at DESC);

-- ============================================================
-- CONTACT SUBMISSIONS
-- ============================================================
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  message TEXT NOT NULL,
  status public.contact_status NOT NULL DEFAULT 'new',
  staff_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact"
  ON public.contact_submissions FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin/staff can view contacts"
  ON public.contact_submissions FOR SELECT TO authenticated
  USING (public.is_admin_or_staff(auth.uid()));

CREATE POLICY "Admin/staff can update contacts"
  ON public.contact_submissions FOR UPDATE TO authenticated
  USING (public.is_admin_or_staff(auth.uid()));

CREATE POLICY "Admin/staff can delete contacts"
  ON public.contact_submissions FOR DELETE TO authenticated
  USING (public.is_admin_or_staff(auth.uid()));

CREATE TRIGGER set_contacts_updated_at
  BEFORE UPDATE ON public.contact_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_contacts_phone ON public.contact_submissions(phone);
CREATE INDEX idx_contacts_status ON public.contact_submissions(status);
CREATE INDEX idx_contacts_created ON public.contact_submissions(created_at DESC);

-- ============================================================
-- WHATSAPP MESSAGES
-- ============================================================
CREATE TABLE public.whatsapp_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone TEXT NOT NULL,
  direction public.wa_direction NOT NULL,
  body TEXT,
  wa_message_id TEXT UNIQUE,
  status public.wa_status,
  lead_id UUID,
  lead_type public.lead_type,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin/staff can view wa messages"
  ON public.whatsapp_messages FOR SELECT TO authenticated
  USING (public.is_admin_or_staff(auth.uid()));

CREATE POLICY "Admin/staff can insert wa messages"
  ON public.whatsapp_messages FOR INSERT TO authenticated
  WITH CHECK (public.is_admin_or_staff(auth.uid()));

CREATE POLICY "Admin/staff can update wa messages"
  ON public.whatsapp_messages FOR UPDATE TO authenticated
  USING (public.is_admin_or_staff(auth.uid()));

CREATE INDEX idx_wa_phone ON public.whatsapp_messages(phone);
CREATE INDEX idx_wa_created ON public.whatsapp_messages(created_at DESC);
CREATE INDEX idx_wa_lead ON public.whatsapp_messages(lead_id, lead_type);

-- Enable realtime for whatsapp_messages
ALTER TABLE public.whatsapp_messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.whatsapp_messages;