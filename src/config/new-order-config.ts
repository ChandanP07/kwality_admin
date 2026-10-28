// Location: src/config/new-order-config.ts
// Configuration for New Order multi-step form

export const newOrderConfig = {
  // Client suggestions for autocomplete
  clientSuggestions: [
    'ABC Corporation',
    'XYZ Industries',
    'Tech Solutions Pvt Ltd',
    'Global Enterprises',
    'Metro Business Solutions',
    'Prime Technologies',
    'Apex Systems',
    'Digital Innovations'
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

  // Branches by City (sample data)
  branchesByCity: {
    'Ahmedabad': ['Ahmedabad Main', 'Satellite Branch', 'Maninagar Branch', 'CG Road Branch'],
    'Surat': ['Surat Central', 'Athwa Branch', 'Varachha Branch'],
    'Vadodara': ['Vadodara Main', 'Alkapuri Branch'],
    'Mumbai': ['Mumbai HQ', 'Andheri Branch', 'Bandra Branch', 'Navi Mumbai'],
    'Pune': ['Pune Main', 'Kothrud Branch', 'Hinjewadi Branch'],
    'Bangalore': ['Bangalore Main', 'Whitefield Branch', 'Koramangala Branch'],
    'Chennai': ['Chennai Main', 'T Nagar Branch', 'Anna Nagar Branch'],
    'Delhi': ['Delhi Main', 'Connaught Place', 'Karol Bagh'],
    'New Delhi': ['New Delhi HQ', 'South Extension', 'Lajpat Nagar'],
    'Kolkata': ['Kolkata Main', 'Salt Lake', 'Park Street'],
    'Hyderabad': ['Hyderabad Main', 'Banjara Hills', 'Gachibowli'],
    // Default for other cities
    'default': ['Main Branch', 'Branch 1', 'Branch 2']
  },

  // Order Types
  orderTypes: [
    'Regular Order',
    'Urgent Order',
    'Bulk Order',
    'Sample Order',
    'Replacement Order'
  ],

  // Printer/Cartridge Models (searchable)
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

  // Type: BLACK or COLOR
  types: ['BLACK', 'COLOR'],

  // Cartridge Model Types
  cartridgeModelTypes: [
    'Original OEM',
    'Compatible',
    'Refurbished',
    'Remanufactured',
    'Generic'
  ]
}

export default newOrderConfig
