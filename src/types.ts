export interface ProductSpecification {
  label: string;
  value: string;
}

export interface ProductSeries {
  id: string;
  name: string;
  shortDesc: string;
  specs: { label: string; value: string }[];
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  shortDesc: string;
  description: string;
  category: string;
  accentColor: string; // Tailwind bg-accent or text-accent hex/class
  badgeColor: string;
  features: string[];
  specifications: ProductSpecification[];
  highlights: string[];
  series?: ProductSeries[];
  image?: string;
  brochure?: string;
  additionalImages?: string[];
}

export interface PastProject {
  id: string;
  title: string;
  location: string;
  category: string;
  year: string;
  machineryUsed: string[];
  description: string;
  metrics: { label: string; value: string }[];
}

export interface NetworkLocation {
  id: string;
  city: string;
  state: string;
  type: 'Manufacturing Unit' | 'Corporate Office' | 'Service Hub' | 'Dealer Outlet';
  address: string;
  coordinates?: { lat: number; lng: number };
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface InquiryFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  projectType?: string;
  selectedProducts: string[];
  estimatedVolume?: string;
  timeline?: string;
  customNotes: string;
  address: string;
}
