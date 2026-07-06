import * as fs from "fs";
import * as path from "path";
import xlsx from "xlsx";

const EXCEL_FILE_PATH = path.resolve(process.cwd(), "database.xlsx");

// Initialize Excel Database if it doesn't exist
export function initExcelDb() {
  try {
    if (!fs.existsSync(EXCEL_FILE_PATH)) {
      const wb = xlsx.utils.book_new();
      
      // Create empty sheet for Contact Us
      const contactSheet = xlsx.utils.json_to_sheet([]);
      xlsx.utils.book_append_sheet(wb, contactSheet, "Contact Us");
      
      // Create empty sheet for Dealership Application
      const dealershipSheet = xlsx.utils.json_to_sheet([]);
      xlsx.utils.book_append_sheet(wb, dealershipSheet, "Dealership Application");
      
      // Create empty sheet for getAquote
      const getAquoteSheet = xlsx.utils.json_to_sheet([]);
      xlsx.utils.book_append_sheet(wb, getAquoteSheet, "getAquote");
      
      xlsx.writeFile(wb, EXCEL_FILE_PATH);
      console.log("Excel Database initialized successfully at:", EXCEL_FILE_PATH);
    } else {
      const wb = xlsx.readFile(EXCEL_FILE_PATH);
      let updated = false;
      if (!wb.SheetNames.includes("Contact Us")) {
        const contactSheet = xlsx.utils.json_to_sheet([]);
        xlsx.utils.book_append_sheet(wb, contactSheet, "Contact Us");
        updated = true;
      }
      if (!wb.SheetNames.includes("Dealership Application")) {
        const dealershipSheet = xlsx.utils.json_to_sheet([]);
        xlsx.utils.book_append_sheet(wb, dealershipSheet, "Dealership Application");
        updated = true;
      }
      if (!wb.SheetNames.includes("getAquote")) {
        const getAquoteSheet = xlsx.utils.json_to_sheet([]);
        xlsx.utils.book_append_sheet(wb, getAquoteSheet, "getAquote");
        updated = true;
      }
      if (updated) {
        xlsx.writeFile(wb, EXCEL_FILE_PATH);
        console.log("Excel Database sheets synchronized successfully.");
      }
    }
  } catch (error) {
    console.error("Error initializing Excel Database:", error);
  }
}

// Save Contact Us record
export function saveContactUs(data: any) {
  try {
    initExcelDb();
    
    const wb = xlsx.readFile(EXCEL_FILE_PATH);
    
    // Read existing contacts sheet
    const sheetName = "Contact Us";
    let contacts: any[] = [];
    
    if (wb.SheetNames.includes(sheetName)) {
      const sheet = wb.Sheets[sheetName];
      contacts = xlsx.utils.sheet_to_json(sheet);
    }
    
    // Add timestamp and new data
    const newRecord = {
      "First Name": data.firstName || "",
      "Last Name": data.lastName || "",
      "Organization": data.organization || "",
      "City": data.city || "",
      "Email ID": data.emailId || "",
      "Mobile No.": data.mobileNo || "",
      "Subject": data.subject || "",
      "Message": data.message || "",
      "Terms Accepted": data.termsAccepted ? "Yes" : "No",
      "Submitted At": new Date().toISOString()
    };
    
    contacts.push(newRecord);
    
    // Convert back to sheet and update workbook
    const updatedSheet = xlsx.utils.json_to_sheet(contacts);
    
    // Set column widths for better readability
    updatedSheet["!cols"] = [
      { wch: 15 }, // First Name
      { wch: 15 }, // Last Name
      { wch: 20 }, // Organization
      { wch: 15 }, // City
      { wch: 25 }, // Email ID
      { wch: 15 }, // Mobile No.
      { wch: 25 }, // Subject
      { wch: 40 }, // Message
      { wch: 15 }, // Terms Accepted
      { wch: 25 }  // Submitted At
    ];
    
    wb.Sheets[sheetName] = updatedSheet;
    
    // If Dealership sheet is missing, make sure it is added
    if (!wb.SheetNames.includes("Dealership Application")) {
      const dealershipSheet = xlsx.utils.json_to_sheet([]);
      xlsx.utils.book_append_sheet(wb, dealershipSheet, "Dealership Application");
    }
    
    xlsx.writeFile(wb, EXCEL_FILE_PATH);
    console.log("Contact submission appended to excel sheet.");
    return true;
  } catch (error) {
    console.error("Error saving Contact Us submission:", error);
    return false;
  }
}

// Save Dealership Application record
export function saveDealershipApplication(data: any) {
  try {
    initExcelDb();
    
    const wb = xlsx.readFile(EXCEL_FILE_PATH);
    
    // Read existing dealership sheet
    const sheetName = "Dealership Application";
    let applications: any[] = [];
    
    if (wb.SheetNames.includes(sheetName)) {
      const sheet = wb.Sheets[sheetName];
      applications = xlsx.utils.sheet_to_json(sheet);
    }
    
    // Add new data matching form parameters
    const newRecord = {
      // Section 1: Region
      "Area Working State": data.areaWorkingState || "",
      "Area Working Country": data.areaWorkingCountry || "",
      
      // Section 2: Company Information
      "Company Name": data.companyName || "",
      "Year Established": data.yearEstablished || "",
      "Business Type": data.businessType || "",
      "Registered Address": data.registeredAddress || "",
      "City State Country": data.cityStateCountry || "",
      "Phone Number": data.phoneNumber || "",
      "Email Address": data.emailAddress || "",
      "Website": data.website || "",
      
      // Section 2: Ownership & Management
      "Owner/MD Name": data.ownerMdName || "",
      "Key Contact Person": data.keyContactPerson || "",
      "Designation": data.designation || "",
      "Mobile Number": data.mobileNumber || "",
      "Email Address (Ownership)": data.emailAddressOwnership || "",
      
      // Section 3: Business Operations
      "Current Business Activities": data.currentBusinessActivities || "",
      "Experience (Years)": data.experienceYears || "",
      "Existing Dealerships": data.existingDealerships || "",
      "Annual Turnover": data.annualTurnover || "",
      "Number of Employees": data.numberOfEmployees || "",
      
      // Section 4: Infrastructure & Facilities
      "Office Space (sq.ft.)": data.officeSpaceSqFt || "",
      "Warehouse Facility": data.warehouseFacility || "",
      "Service Workshop": data.serviceWorkshop || "",
      "Showroom Facility": data.showroomFacility || "",
      "Sales Staff Strength": data.salesStaffStrength || "",
      
      // Section 5: Market Coverage
      "Geographical Area Operation": data.geographicalAreaOperation || "",
      "Target Customer Segments": Array.isArray(data.targetCustomerSegments) ? data.targetCustomerSegments.join(", ") : data.targetCustomerSegments || "",
      "Marketing Channels Used": Array.isArray(data.marketingChannelsUsed) ? data.marketingChannelsUsed.join(", ") : data.marketingChannelsUsed || "",
      
      // Section 6: Declaration
      "Authorized Signatory": data.authorizedSignatory || "",
      "Declaration Name/Designation": data.declarationNameDesignation || "",
      "Declaration Date": data.declarationDate || "",
      "Company Seal/Stamp": data.companySealStamp || "",
      
      "Submitted At": new Date().toISOString()
    };
    
    applications.push(newRecord);
    
    // Convert back to sheet and update workbook
    const updatedSheet = xlsx.utils.json_to_sheet(applications);
    
    // Set column widths for better readability
    updatedSheet["!cols"] = Object.keys(newRecord).map(() => ({ wch: 20 }));
    
    wb.Sheets[sheetName] = updatedSheet;
    
    // If Contact sheet is missing, make sure it is added
    if (!wb.SheetNames.includes("Contact Us")) {
      const contactSheet = xlsx.utils.json_to_sheet([]);
      xlsx.utils.book_append_sheet(wb, contactSheet, "Contact Us");
    }
    
    xlsx.writeFile(wb, EXCEL_FILE_PATH);
    console.log("Dealership Application appended to excel sheet.");
    return true;
  } catch (error) {
    console.error("Error saving Dealership Application submission:", error);
    return false;
  }
}

// Save Get A Quote record
export function saveGetAQuote(data: any) {
  try {
    initExcelDb();
    
    const wb = xlsx.readFile(EXCEL_FILE_PATH);
    
    const sheetName = "getAquote";
    let quotes: any[] = [];
    
    if (wb.SheetNames.includes(sheetName)) {
      const sheet = wb.Sheets[sheetName];
      quotes = xlsx.utils.sheet_to_json(sheet);
    }
    
    const newRecord = {
      "Full Name": data.name || "",
      "Company Name": data.company || "",
      "Email Address": data.email || "",
      "Phone Number": data.phone || "",
      "Address": data.address || "",
      "Product Selection": Array.isArray(data.selectedProducts) ? data.selectedProducts.join(", ") : data.selectedProducts || "",
      "Message / Custom Requirement": data.customNotes || "",
      "Submitted At": new Date().toISOString()
    };
    
    quotes.push(newRecord);
    
    const updatedSheet = xlsx.utils.json_to_sheet(quotes);
    updatedSheet["!cols"] = Object.keys(newRecord).map(() => ({ wch: 25 }));
    
    wb.Sheets[sheetName] = updatedSheet;
    
    xlsx.writeFile(wb, EXCEL_FILE_PATH);
    console.log("Quote submission saved in excel getAquote sheet.");
    return true;
  } catch (error) {
    console.error("Error saving Get A Quote submission:", error);
    return false;
  }
}
