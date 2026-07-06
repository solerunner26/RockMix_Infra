import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSiteContent } from '../context/SiteContentContext';
import { 
  Award, 
  MapPin, 
  Building, 
  Calendar, 
  Phone, 
  Mail, 
  Globe, 
  User, 
  Briefcase, 
  TrendingUp, 
  Users, 
  FileText, 
  Warehouse, 
  Home, 
  Wrench, 
  Eye, 
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export default function DealershipSection() {
  const { content } = useSiteContent();

  if (!content.dealership.showSection) return null;

  // Form State
  const [formData, setFormData] = useState({
    // Section 1: Region
    areaWorkingState: '',
    areaWorkingCountry: '',
    
    // Section 2: Company Information
    companyName: '',
    yearEstablished: '',
    businessType: 'Sole Proprietorship', // Sole Proprietorship / Partnership / Private Ltd. / Public Ltd.
    registeredAddress: '',
    cityStateCountry: '',
    phoneNumber: '',
    emailAddress: '',
    website: '',
    
    // Section 3: Ownership & Management
    ownerMdName: '',
    keyContactPerson: '',
    designation: '',
    mobileNumber: '',
    emailAddressOwnership: '',
    
    // Section 4: Business Operations
    currentBusinessActivities: '',
    experienceYears: '',
    existingDealerships: '',
    annualTurnover: '',
    numberOfEmployees: '',
    
    // Section 5: Infrastructure & Facilities
    officeSpaceSqFt: '',
    warehouseFacility: 'No', // Yes / No
    serviceWorkshop: 'No', // Yes / No
    showroomFacility: 'No', // Yes / No
    salesStaffStrength: '',
    
    // Section 6: Market Coverage
    geographicalAreaOperation: '',
    targetCustomerSegments: [] as string[], // Contractors, Builders, Govt. Projects, Rental Companies, Others
    marketingChannelsUsed: [] as string[], // Online, Offline, Trade Shows, Dealer Network
    
    // Section 7: Declaration
    authorizedSignatory: '',
    declarationNameDesignation: '',
    declarationDate: new Date().toISOString().split('T')[0]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle Input Changes
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle Checkbox arrays
  const handleCheckboxChange = (category: 'targetCustomerSegments' | 'marketingChannelsUsed', value: string) => {
    setFormData(prev => {
      const current = prev[category];
      const updated = current.includes(value) 
        ? current.filter(item => item !== value) 
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/dealership/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsSent(true);
        // Reset form data
        setFormData({
          areaWorkingState: '',
          areaWorkingCountry: '',
          companyName: '',
          yearEstablished: '',
          businessType: 'Sole Proprietorship',
          registeredAddress: '',
          cityStateCountry: '',
          phoneNumber: '',
          emailAddress: '',
          website: '',
          ownerMdName: '',
          keyContactPerson: '',
          designation: '',
          mobileNumber: '',
          emailAddressOwnership: '',
          currentBusinessActivities: '',
          experienceYears: '',
          existingDealerships: '',
          annualTurnover: '',
          numberOfEmployees: '',
          officeSpaceSqFt: '',
          warehouseFacility: 'No',
          serviceWorkshop: 'No',
          showroomFacility: 'No',
          salesStaffStrength: '',
          geographicalAreaOperation: '',
          targetCustomerSegments: [],
          marketingChannelsUsed: [],
          authorizedSignatory: '',
          declarationNameDesignation: '',
          declarationDate: new Date().toISOString().split('T')[0]
        });
      } else {
        const errData = await res.json();
        setError(errData.error || 'Failed to submit dealership application. Please try again.');
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      setError('A network error occurred. Please verify your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const businessTypes = ['Sole Proprietorship', 'Partnership', 'Private Ltd.', 'Public Ltd.'];
  const customerSegments = ['Contractors', 'Builders', 'Govt. Projects', 'Rental Companies', 'Others'];
  const marketingChannels = ['Online', 'Offline', 'Trade Shows', 'Dealer Network'];

  return (
    <section id="dealership-inquiry-section" className="pt-[140px] md:pt-[160px] pb-24 px-4 max-w-7xl mx-auto space-y-16 relative">
      <div className="absolute top-[10%] right-[10%] w-96 h-96 bg-indigo-50/30 blur-3xl rounded-full -z-10 pointer-events-none dark:hidden"></div>
      
      {/* Header */}
      <div className="text-center max-w-4xl mx-auto space-y-4">
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {content.dealership.title}
        </h2>
        <p className="font-sans text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base max-w-3xl mx-auto text-justify">
          {content.dealership.description}
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {!isSent ? (
            <motion.form
              key="dealership-form"
              onSubmit={handleSubmit}
              className="space-y-10 bg-white/80 dark:bg-slate-900/80 p-6 sm:p-10 rounded-3xl shadow-xl border border-slate-200/50 dark:border-slate-800/80 backdrop-blur-xl text-left"
            >
              {error && (
                <div className="flex items-center space-x-3 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/50 p-4 rounded-xl text-xs sm:text-sm">
                  <AlertTriangle className="h-5 w-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Section 1: Region */}
              <div className="space-y-4 border-b border-slate-200/60 dark:border-slate-800 pb-6">
                <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
                  <MapPin className="h-5 w-5" />
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                    Section 1: Region of Interest
                  </h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Target Working State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="areaWorkingState"
                      required
                      value={formData.areaWorkingState}
                      onChange={handleTextChange}
                      placeholder="e.g. Gujarat"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Target Working Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="areaWorkingCountry"
                      required
                      value={formData.areaWorkingCountry}
                      onChange={handleTextChange}
                      placeholder="e.g. India"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Company Information */}
              <div className="space-y-4 border-b border-slate-200/60 dark:border-slate-800 pb-6">
                <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
                  <Building className="h-5 w-5" />
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                    Section 2: Company Information
                  </h3>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      required
                      value={formData.companyName}
                      onChange={handleTextChange}
                      placeholder="e.g. Landmark Infrastructure Ltd."
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Year Established <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="yearEstablished"
                      required
                      value={formData.yearEstablished}
                      onChange={handleTextChange}
                      placeholder="e.g. 2012"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none dark:text-white"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-3">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                      Business Type <span className="text-red-500">*</span>
                    </span>
                    <div className="flex flex-wrap gap-4">
                      {businessTypes.map((type) => (
                        <label key={type} className="flex items-center space-x-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                          <input
                            type="radio"
                            name="businessType"
                            value={type}
                            checked={formData.businessType === type}
                            onChange={handleTextChange}
                            className="text-indigo-600 focus:ring-indigo-500 h-4 w-4 border-slate-300"
                          />
                          <span>{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1 sm:col-span-3">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Registered Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="registeredAddress"
                      required
                      rows={2}
                      value={formData.registeredAddress}
                      onChange={handleTextChange}
                      placeholder="Full Corporate/Registered Address..."
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none dark:text-white resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      City, State & Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cityStateCountry"
                      required
                      value={formData.cityStateCountry}
                      onChange={handleTextChange}
                      placeholder="Ahmedabad, Gujarat, India"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      required
                      value={formData.phoneNumber}
                      onChange={handleTextChange}
                      placeholder="e.g. +91 90335 23175"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="emailAddress"
                      required
                      value={formData.emailAddress}
                      onChange={handleTextChange}
                      placeholder="info@landmarkinfra.com"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none dark:text-white"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-3">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Website URL (if any)
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleTextChange}
                      placeholder="https://www.landmarkinfra.com"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Ownership & Management */}
              <div className="space-y-4 border-b border-slate-200/60 dark:border-slate-800 pb-6">
                <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
                  <User className="h-5 w-5" />
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                    Section 3: Ownership & Management
                  </h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Owner / Managing Director Name
                    </label>
                    <input
                      type="text"
                      name="ownerMdName"
                      value={formData.ownerMdName}
                      onChange={handleTextChange}
                      placeholder="e.g. Ramesh Patel"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Key Contact Person
                    </label>
                    <input
                      type="text"
                      name="keyContactPerson"
                      value={formData.keyContactPerson}
                      onChange={handleTextChange}
                      placeholder="e.g. Sameer Patel"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Designation
                    </label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleTextChange}
                      placeholder="e.g. VP Business Development"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleTextChange}
                      placeholder="e.g. +91 90335 23175"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none dark:text-white"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Email Address (Ownership)
                    </label>
                    <input
                      type="email"
                      name="emailAddressOwnership"
                      value={formData.emailAddressOwnership}
                      onChange={handleTextChange}
                      placeholder="e.g. ramesh.patel@landmarkinfra.com"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Business Operations */}
              <div className="space-y-4 border-b border-slate-200/60 dark:border-slate-800 pb-6">
                <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
                  <Briefcase className="h-5 w-5" />
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                    Section 4: Business Operations
                  </h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Current Business Activities
                    </label>
                    <input
                      type="text"
                      name="currentBusinessActivities"
                      value={formData.currentBusinessActivities}
                      onChange={handleTextChange}
                      placeholder="e.g. Infrastructure contractor, raw material dealer, mining equipment supply"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Experience in Construction Equipment (Years)
                    </label>
                    <input
                      type="number"
                      name="experienceYears"
                      value={formData.experienceYears}
                      onChange={handleTextChange}
                      placeholder="e.g. 8"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Existing Dealerships (if any)
                    </label>
                    <input
                      type="text"
                      name="existingDealerships"
                      value={formData.existingDealerships}
                      onChange={handleTextChange}
                      placeholder="e.g. Crane Co, RoadRoller Brand"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Annual Turnover (INR/USD)
                    </label>
                    <input
                      type="text"
                      name="annualTurnover"
                      value={formData.annualTurnover}
                      onChange={handleTextChange}
                      placeholder="e.g. 15 Crores INR"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Number of Employees
                    </label>
                    <input
                      type="number"
                      name="numberOfEmployees"
                      value={formData.numberOfEmployees}
                      onChange={handleTextChange}
                      placeholder="e.g. 45"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Infrastructure & Facilities */}
              <div className="space-y-4 border-b border-slate-200/60 dark:border-slate-800 pb-6">
                <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
                  <Warehouse className="h-5 w-5" />
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                    Section 5: Infrastructure & Facilities
                  </h3>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Office Space (sq. ft.)
                    </label>
                    <input
                      type="number"
                      name="officeSpaceSqFt"
                      value={formData.officeSpaceSqFt}
                      onChange={handleTextChange}
                      placeholder="e.g. 2500"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Warehouse / Storage Facility
                    </label>
                    <select
                      name="warehouseFacility"
                      value={formData.warehouseFacility}
                      onChange={handleTextChange}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none dark:text-white"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Service Workshop Facility
                    </label>
                    <select
                      name="serviceWorkshop"
                      value={formData.serviceWorkshop}
                      onChange={handleTextChange}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none dark:text-white"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Showroom Facility Available
                    </label>
                    <select
                      name="showroomFacility"
                      value={formData.showroomFacility}
                      onChange={handleTextChange}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none dark:text-white"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Sales & Service Staff Strength
                    </label>
                    <input
                      type="number"
                      name="salesStaffStrength"
                      value={formData.salesStaffStrength}
                      onChange={handleTextChange}
                      placeholder="e.g. 12"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Section 6: Market Coverage */}
              <div className="space-y-4 border-b border-slate-200/60 dark:border-slate-800 pb-6">
                <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
                  <TrendingUp className="h-5 w-5" />
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                    Section 6: Market Coverage
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Geographical Area of Operation
                    </label>
                    <input
                      type="text"
                      name="geographicalAreaOperation"
                      value={formData.geographicalAreaOperation}
                      onChange={handleTextChange}
                      placeholder="e.g. Western Gujarat and South Rajasthan region"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none dark:text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Target Customer Segments
                    </span>
                    <div className="flex flex-wrap gap-4">
                      {customerSegments.map(seg => (
                        <label key={seg} className="flex items-center space-x-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.targetCustomerSegments.includes(seg)}
                            onChange={() => handleCheckboxChange('targetCustomerSegments', seg)}
                            className="text-indigo-600 focus:ring-indigo-500 rounded border-slate-300 dark:border-slate-800 h-4 w-4"
                          />
                          <span>{seg}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Marketing Channels Used
                    </span>
                    <div className="flex flex-wrap gap-4">
                      {marketingChannels.map(channel => (
                        <label key={channel} className="flex items-center space-x-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.marketingChannelsUsed.includes(channel)}
                            onChange={() => handleCheckboxChange('marketingChannelsUsed', channel)}
                            className="text-indigo-600 focus:ring-indigo-500 rounded border-slate-300 dark:border-slate-800 h-4 w-4"
                          />
                          <span>{channel}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 7: Declaration */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <FileText className="h-5 w-5" />
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                    Section 7: Declaration
                  </h3>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/45 border border-slate-200/55 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                  "I/We hereby declare that the information provided above is true and correct to the best of my/our knowledge. I/We agree to abide by the terms and conditions set forth by Rockmix Infra Equipments Pvt. Ltd. for dealership operations."
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Authorized Signatory Name
                    </label>
                    <input
                      type="text"
                      name="authorizedSignatory"
                      value={formData.authorizedSignatory}
                      onChange={handleTextChange}
                      placeholder="e.g. Ramesh K. Patel"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Name & Designation of Signatory
                    </label>
                    <input
                      type="text"
                      name="declarationNameDesignation"
                      value={formData.declarationNameDesignation}
                      onChange={handleTextChange}
                      placeholder="e.g. Ramesh Patel, Managing Director"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Date
                    </label>
                    <input
                      type="date"
                      name="declarationDate"
                      value={formData.declarationDate}
                      onChange={handleTextChange}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm py-4 transition-all active:scale-[0.98] shadow-lg shadow-indigo-200/45 dark:shadow-none"
                  id="submit-dealership-btn"
                >
                  <Award className="h-5 w-5 animate-pulse" />
                  <span>{isSubmitting ? 'Processing Application...' : 'SUBMIT DEALERSHIP APPLICATION'}</span>
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="sent-confirmation"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-16 text-center space-y-6 bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl shadow-xl border border-slate-200/55 dark:border-slate-800 max-w-xl mx-auto"
              id="dealership-sent-screen"
            >
              <div className="h-20 w-20 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto shadow-sm">
                <CheckCircle className="h-10 w-10" />
              </div>
              
              <div className="space-y-3">
                <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                  Application Submitted Successfully!
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  Thank you for applying for a Rockmix Infra dealership. Your corporate details and market coverage specifications have been recorded securely in our Excel database. Our business development team (<span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">bdm@rockmixgroup.com</span>) will evaluate your profile and contact you shortly.
                </p>
              </div>

              <button
                onClick={() => setIsSent(false)}
                className="inline-flex items-center space-x-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 text-xs font-bold px-5 py-2.5 transition-all"
              >
                <span>Submit Another Application</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
