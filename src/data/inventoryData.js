export const INITIAL_INVENTORY_ITEMS = [
  {
    id: "INV-CAP-45",
    code: "CAP-45-450",
    name: "Dual Motor Run Capacitor 45uF + 5uF / 450VAC",
    category: "Electrical & HVAC",
    unit: "pcs",
    stock: 12,
    reorderLevel: 8,
    unitCost: "LKR 2,450",
    location: "Aisle 3, Bin B-14",
    status: "In Stock",
    lastUpdated: "2026-09-18"
  },
  {
    id: "INV-GAS-R410A",
    code: "GAS-R410A-11KG",
    name: "R410A Eco Refrigerant Cylinder (11.3 kg)",
    category: "Electrical & HVAC",
    unit: "cylinders",
    stock: 3,
    reorderLevel: 4,
    unitCost: "LKR 38,000",
    location: "Gas Storage Cage 02",
    status: "Low Stock",
    lastUpdated: "2026-09-18"
  },
  {
    id: "INV-PLB-HOSE45",
    code: "PLB-SS-FLEX450",
    name: "SS Braided Flexible Hose 1/2\" x 450mm",
    category: "Plumbing",
    unit: "pcs",
    stock: 18,
    reorderLevel: 10,
    unitCost: "LKR 850",
    location: "Aisle 1, Rack P-04",
    status: "In Stock",
    lastUpdated: "2026-09-19"
  },
  {
    id: "INV-PRJ-ELPLP97",
    code: "PRJ-LAMP-ELPLP97",
    name: "Epson ELPLP97 Replacement Projector Lamp 210W",
    category: "IT & Audiovisual",
    unit: "units",
    stock: 0,
    reorderLevel: 2,
    unitCost: "LKR 24,500",
    location: "Secure AV Vault",
    status: "Out of Stock",
    lastUpdated: "2026-09-19"
  },
  {
    id: "INV-ELE-LEDT8",
    code: "ELE-LED-T8-18W",
    name: "Philips 18W T8 LED Tube 1200mm (Cool Daylight)",
    category: "Electrical",
    unit: "tubes",
    stock: 45,
    reorderLevel: 20,
    unitCost: "LKR 950",
    location: "Aisle 2, Bay L-01",
    status: "In Stock",
    lastUpdated: "2026-09-19"
  },
  {
    id: "INV-NET-CAT6",
    code: "NET-CAT6-RJ45",
    name: "Cat6 RJ45 Keystone Jack Modules (Schneider/AMP)",
    category: "Network & IT",
    unit: "pcs",
    stock: 32,
    reorderLevel: 15,
    unitCost: "LKR 620",
    location: "Networking Bin N-12",
    status: "In Stock",
    lastUpdated: "2026-09-17"
  },
  {
    id: "INV-NET-PATCH2M",
    code: "NET-PATCH-2M-BLU",
    name: "Molded Cat6 UTP Patch Cord 2-meter (Blue)",
    category: "Network & IT",
    unit: "pcs",
    stock: 24,
    reorderLevel: 12,
    unitCost: "LKR 480",
    location: "Networking Bin N-08",
    status: "In Stock",
    lastUpdated: "2026-09-17"
  },
  {
    id: "INV-CIV-DOORCLOSER",
    code: "CIV-HYD-DC-EN4",
    name: "Heavy Duty Hydraulic Overhead Door Closer EN4",
    category: "Civil & Hardware",
    unit: "units",
    stock: 2,
    reorderLevel: 5,
    unitCost: "LKR 9,800",
    location: "Hardware Shelf H-06",
    status: "Low Stock",
    lastUpdated: "2026-09-16"
  },
  {
    id: "INV-PLB-VALVE12",
    code: "PLB-BRASS-VALVE12",
    name: "Brass Angle Stop Valve 1/2\" Chrome Plated",
    category: "Plumbing",
    unit: "pcs",
    stock: 15,
    reorderLevel: 8,
    unitCost: "LKR 1,350",
    location: "Aisle 1, Rack P-08",
    status: "In Stock",
    lastUpdated: "2026-09-15"
  },
  {
    id: "INV-ELE-MCB16",
    code: "ELE-MCB-1P-16A",
    name: "Single Pole MCB 16A Type C (ABB/Schneider)",
    category: "Electrical",
    unit: "pcs",
    stock: 28,
    reorderLevel: 10,
    unitCost: "LKR 1,150",
    location: "Aisle 3, Bin E-03",
    status: "In Stock",
    lastUpdated: "2026-09-14"
  }
];

export const INITIAL_ITEM_REQUESTS = [
  {
    id: "REQ-2026-088",
    ticketId: "MRS-2026-0142",
    technician: "S. Kandeepan",
    technicianTrade: "Plumbing & Water Systems",
    itemCode: "PLB-SS-FLEX450",
    itemName: "SS Braided Flexible Hose 1/2\" x 450mm",
    quantity: 2,
    unit: "pcs",
    urgency: "Urgent",
    requestedAt: "2026-09-19 09:05 AM",
    status: "Pending",
    notes: "For emergency sink replacement at Chemistry Lab, Building B."
  },
  {
    id: "REQ-2026-087",
    ticketId: "MRS-2026-0150",
    technician: "R. Thuvaragan",
    technicianTrade: "IT & Network Infrastructure",
    itemCode: "PRJ-LAMP-ELPLP97",
    itemName: "Epson ELPLP97 Replacement Projector Lamp 210W",
    quantity: 1,
    unit: "units",
    urgency: "High",
    requestedAt: "2026-09-19 09:30 AM",
    status: "Out of Stock - PO Raised",
    notes: "LH-03 Projector burned out. Zero stock in stores."
  },
  {
    id: "REQ-2026-086",
    ticketId: "MRS-2026-0153",
    technician: "N. Pathmanathan",
    technicianTrade: "Electrical & HVAC",
    itemCode: "ELE-LED-T8-18W",
    itemName: "Philips 18W T8 LED Tube 1200mm",
    quantity: 2,
    unit: "tubes",
    urgency: "Urgent",
    requestedAt: "2026-09-19 10:35 AM",
    status: "Issued",
    notes: "Issued for Exam Division room 12 fluorescent luminaire retrofit."
  },
  {
    id: "REQ-2026-085",
    ticketId: "MRS-2026-0148",
    technician: "N. Pathmanathan",
    technicianTrade: "Electrical & HVAC",
    itemCode: "CAP-45-450",
    itemName: "Dual Motor Run Capacitor 45uF + 5uF",
    quantity: 1,
    unit: "pcs",
    urgency: "High",
    requestedAt: "2026-09-18 03:30 PM",
    status: "Issued",
    notes: "Seminar Room 204 AC outdoor compressor repair."
  }
];

export const INITIAL_TRANSACTIONS = [
  {
    id: "TXN-2026-441",
    timestamp: "2026-09-19 10:40 AM",
    type: "Issue",
    itemCode: "ELE-LED-T8-18W",
    itemName: "Philips 18W T8 LED Tube 1200mm",
    quantity: 2,
    issuedTo: "N. Pathmanathan (Technician)",
    ticketRef: "MRS-2026-0153",
    authorizedBy: "M. Fernando (Store Keeper)"
  },
  {
    id: "TXN-2026-440",
    timestamp: "2026-09-19 08:30 AM",
    type: "Stock Receipt",
    itemCode: "ELE-MCB-1P-16A",
    itemName: "Single Pole MCB 16A Type C",
    quantity: 20,
    issuedTo: "Stores Replenishment",
    ticketRef: "PO-2026-074",
    authorizedBy: "M. Fernando (Store Keeper)"
  },
  {
    id: "TXN-2026-439",
    timestamp: "2026-09-18 03:45 PM",
    type: "Issue",
    itemCode: "CAP-45-450",
    itemName: "Dual Motor Run Capacitor 45uF + 5uF",
    quantity: 1,
    issuedTo: "N. Pathmanathan (Technician)",
    ticketRef: "MRS-2026-0148",
    authorizedBy: "M. Fernando (Store Keeper)"
  },
  {
    id: "TXN-2026-438",
    timestamp: "2026-09-18 09:45 AM",
    type: "Issue",
    itemCode: "NET-CAT6-RJ45",
    itemName: "Cat6 RJ45 Keystone Jack Modules",
    quantity: 3,
    issuedTo: "R. Thuvaragan (Technician)",
    ticketRef: "MRS-2026-0137",
    authorizedBy: "M. Fernando (Store Keeper)"
  }
];
