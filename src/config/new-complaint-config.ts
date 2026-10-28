// Location: src/config/new-complaint-config.ts
// Configuration for New Complaint multi-step form

export const newComplaintConfig = {
  // Client suggestions for autocomplete
  clientSuggestions: [
    'ABC Corporation',
    'XYZ Industries',
    'Tech Solutions Pvt Ltd',
    'Global Enterprises',
    'Metro Business Solutions',
    'Prime Technologies',
    'Apex Systems',
    'Digital Innovations',
    'Restaurant Brands Asia Limited',
    'Supreme Industries'
  ],

  // India States (major states)
  states: [
    'Andhra Pradesh',
    'Delhi',
    'Gujarat',
    'Karnataka',
    'Maharashtra',
    'Punjab',
    'Rajasthan',
    'Tamil Nadu',
    'Uttar Pradesh',
    'West Bengal'
  ],

  // Cities by State (cascading data)
  citiesByState: {
    'Andhra Pradesh': ['Hyderabad', 'Visakhapatnam', 'Vijayawada', 'Guntur'],
    'Delhi': ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar'],
    'Karnataka': ['Bangalore', 'Mysore', 'Mangalore', 'Hubli'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
    'Punjab': ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Noida'],
    'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol']
  },

  // Locations by City (sample data)
  locationsByCity: {
    'Ahmedabad': ['Satellite', 'Maninagar', 'CG Road', 'Vastrapur', 'Bopal', 'Paldi'],
    'Surat': ['Athwa', 'Varachha', 'Adajan', 'Rander', 'City Light'],
    'Vadodara': ['Alkapuri', 'Sayajigunj', 'Manjalpur', 'Gotri'],
    'Mumbai': ['Andheri', 'Bandra', 'Navi Mumbai', 'Powai', 'Goregaon', 'Malad'],
    'Pune': ['Kothrud', 'Hinjewadi', 'Wakad', 'Baner', 'Viman Nagar'],
    'Bangalore': ['Whitefield', 'Koramangala', 'Indiranagar', 'Electronic City', 'HSR Layout'],
    'Chennai': ['T Nagar', 'Anna Nagar', 'Velachery', 'Adyar', 'Porur'],
    'Delhi': ['Connaught Place', 'Karol Bagh', 'Lajpat Nagar', 'Dwarka'],
    'New Delhi': ['South Extension', 'Lajpat Nagar', 'Greater Kailash', 'Defence Colony'],
    'Kolkata': ['Salt Lake', 'Park Street', 'New Town', 'Ballygunge'],
    'Hyderabad': ['Banjara Hills', 'Gachibowli', 'Madhapur', 'Hitech City'],
    // Default for other cities
    'default': ['Main Area', 'Area 1', 'Area 2', 'Area 3']
  },

  // Printer Models (sample data)
  printerModels: [
    'HP LaserJet Pro M404dn',
    'HP LaserJet Pro M428fdw',
    'HP DeskJet 2755',
    'HP OfficeJet Pro 9015',
    'Canon PIXMA G6020',
    'Canon imageRUNNER 2425',
    'Canon PIXMA MG3620',
    'Epson EcoTank L3150',
    'Epson WorkForce WF-7720',
    'Brother HL-L2350DW',
    'Brother MFC-L2750DW',
    'Samsung Xpress M2020W',
    'Xerox WorkCentre 3225',
    'Kyocera ECOSYS M3145dn'
  ],

  // Serial Numbers by Printer Model
  serialNumbersByModel: {
    'HP LaserJet Pro M404dn': ['HP-M404-001', 'HP-M404-002', 'HP-M404-003', 'HP-M404-004'],
    'HP LaserJet Pro M428fdw': ['HP-M428-001', 'HP-M428-002', 'HP-M428-003'],
    'Canon PIXMA G6020': ['CN-G6020-001', 'CN-G6020-002', 'CN-G6020-003'],
    'Epson EcoTank L3150': ['EP-L3150-001', 'EP-L3150-002', 'EP-L3150-003'],
    'Brother HL-L2350DW': ['BR-L2350-001', 'BR-L2350-002'],
    'default': ['SN-001', 'SN-002', 'SN-003', 'SN-004', 'SN-005']
  },

  // Printer Details by Serial Number (for modal display)
  printerDetailsBySerial: {
    'HP-M404-001': {
      serialNumber: 'HP-M404-001',
      model: 'HP LaserJet Pro M404dn',
      location: 'Mumbai - Andheri Office',
      installDate: '2023-05-15',
      lastService: '2024-12-10',
      status: 'Active',
      pageCount: 15420
    },
    'HP-M404-002': {
      serialNumber: 'HP-M404-002',
      model: 'HP LaserJet Pro M404dn',
      location: 'Pune - Hinjewadi Office',
      installDate: '2023-06-20',
      lastService: '2024-11-25',
      status: 'Active',
      pageCount: 12350
    }
  },

  // Printer Problems (common issues)
  printerProblems: [
    'Paper Jam',
    'Print Quality Issue - Faded/Light',
    'Print Quality Issue - Streaks/Lines',
    'Print Quality Issue - Smudges',
    'Not Printing - No Response',
    'Not Printing - Error Message',
    'Slow Printing',
    'Network/Connectivity Issue',
    'Toner/Ink Low',
    'Toner/Ink Empty',
    'Paper Feed Issue',
    'Scanner Not Working',
    'Fax Not Working',
    'Strange Noise/Sounds',
    'Overheating',
    'Software/Driver Issue',
    'Other'
  ]
}

export default newComplaintConfig
