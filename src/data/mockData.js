export const UNIVERSITY_INFO = {
  name: "University of Vavuniya",
  shortName: "UoV",
  subName: "இலங்கை வவுனியா பல்கலைக்கழகம்",
  campus: "Pambaimadu Campus, Vavuniya, Sri Lanka",
  systemName: "Maintenance Request System (MRS)",
  systemCode: "UOV-MRS-v2.6",
  supportContact: "ext-4211 | maintenance@vau.ac.lk",
  hours: "Mon - Fri: 08:00 - 16:30 | Emergency Maintenance: 24/7"
};

export const USER_ROLES = {
  STAFF: {
    id: "general_user",
    label: "General User / Staff",
    description: "Academic & administrative staff reporting maintenance needs",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    defaultUser: {
      id: "usr-01",
      name: "Dr. K. Sivalingam",
      email: "k.sivalingam@vau.ac.lk",
      role: "general_user",
      roleName: "Senior Lecturer Gr. I",
      department: "Department of Physical Science",
      faculty: "Faculty of Applied Science",
      phone: "+94 24 222 3311 (Ext. 204)",
      avatar: "KS"
    }
  },
  DEPT_ADMIN: {
    id: "dept_admin",
    label: "Department Admin / HOD",
    description: "Reviews, prioritizes and assigns departmental work orders",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    defaultUser: {
      id: "usr-02",
      name: "Prof. T. Ramanathan",
      email: "hod.physical@vau.ac.lk",
      role: "dept_admin",
      roleName: "Head of Department (HOD)",
      department: "Department of Physical Science",
      faculty: "Faculty of Applied Science",
      phone: "+94 24 222 3300 (Ext. 201)",
      avatar: "TR"
    }
  },
  TECHNICIAN: {
    id: "technician",
    label: "Technician / Specialist",
    description: "Inspects, diagnoses, executes repairs & submits work reports",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    defaultUser: {
      id: "usr-03",
      name: "N. Pathmanathan",
      email: "tech.electrical@vau.ac.lk",
      role: "technician",
      roleName: "Senior HVAC & Electrical Technician",
      department: "Works & Maintenance Division",
      faculty: "Central Facilities",
      phone: "+94 77 123 4567",
      avatar: "NP",
      trade: "Electrical & HVAC",
      activeJobsCount: 3
    }
  },
  STORE_KEEPER: {
    id: "store_keeper",
    label: "Store Keeper / Inventory",
    description: "Issues maintenance spare parts and controls inventory stock",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    defaultUser: {
      id: "usr-04",
      name: "M. Fernando",
      email: "stores@vau.ac.lk",
      role: "store_keeper",
      roleName: "Central Maintenance Store Keeper",
      department: "Central Maintenance Stores",
      faculty: "Administration & Stores",
      phone: "+94 24 222 4110",
      avatar: "MF"
    }
  },
  SUPER_ADMIN: {
    id: "super_admin",
    label: "System Super Admin",
    description: "Full platform configuration, user roles, SLAs, and audits",
    badgeColor: "bg-slate-900 text-white border-slate-700",
    defaultUser: {
      id: "usr-05",
      name: "S. Wijesinghe",
      email: "admin.it@vau.ac.lk",
      role: "super_admin",
      roleName: "Director of IT & Campus Works",
      department: "IT Centre & Administration",
      faculty: "University Administration",
      phone: "+94 24 222 0001",
      avatar: "SW"
    }
  }
};

export const CATEGORIES = [
  { id: "electrical", name: "Electrical", icon: "Zap", color: "text-amber-600 bg-amber-50 border-amber-200", squad: "Electrical Works Unit", defaultSlaHours: 12 },
  { id: "hvac", name: "Air Conditioning", icon: "Wind", color: "text-cyan-600 bg-cyan-50 border-cyan-200", squad: "HVAC & Refrigeration Unit", defaultSlaHours: 24 },
  { id: "plumbing", name: "Plumbing & Water", icon: "Droplets", color: "text-blue-600 bg-blue-50 border-blue-200", squad: "Water & Sanitation Unit", defaultSlaHours: 8 },
  { id: "it_infra", name: "IT Infrastructure", icon: "Server", color: "text-indigo-600 bg-indigo-50 border-indigo-200", squad: "Network & Systems Division", defaultSlaHours: 12 },
  { id: "civil", name: "Civil Works", icon: "Hammer", color: "text-orange-600 bg-orange-50 border-orange-200", squad: "Building Maintenance & Carpentry", defaultSlaHours: 48 },
  { id: "furniture", name: "Furniture & Fittings", icon: "Armchair", color: "text-stone-600 bg-stone-50 border-stone-200", squad: "Carpentry & Joinery Shop", defaultSlaHours: 48 },
  { id: "network", name: "Network & Telecom", icon: "Wifi", color: "text-violet-600 bg-violet-50 border-violet-200", squad: "Telecom & Fiber Support", defaultSlaHours: 8 },
  { id: "safety", name: "Fire & Safety", icon: "ShieldAlert", color: "text-red-600 bg-red-50 border-red-200", squad: "Safety & Emergency Unit", defaultSlaHours: 4 }
];

export const PRIORITIES = {
  Low: {
    label: "Low",
    sla: "72 hours",
    description: "Cosmetic issues, non-urgent routine maintenance that does not impede work.",
    color: "bg-slate-100 text-slate-700 border-slate-200",
    dot: "bg-slate-400"
  },
  Medium: {
    label: "Medium",
    sla: "24 hours",
    description: "Operational impediment affecting an individual office or minor equipment.",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500"
  },
  High: {
    label: "High",
    sla: "12 hours",
    description: "Disrupts active lectures, laboratory sessions, or significant office work.",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500"
  },
  Urgent: {
    label: "Urgent",
    sla: "2-4 hours",
    description: "Immediate safety hazard, severe water leak, power outage, or security risk.",
    color: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500"
  }
};

export const STATUS_CONFIG = {
  Submitted: {
    label: "Submitted",
    badge: "bg-sky-50 text-sky-700 border-sky-200",
    dot: "bg-sky-500",
    description: "Logged by user, awaiting department review"
  },
  "Pending Review": {
    label: "Pending Review",
    badge: "bg-amber-50 text-amber-800 border-amber-200",
    dot: "bg-amber-500",
    description: "Under inspection by Department Head / Admin"
  },
  Approved: {
    label: "Approved",
    badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
    dot: "bg-indigo-500",
    description: "Verified by Department, queued for technician dispatch"
  },
  Assigned: {
    label: "Assigned",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-600",
    description: "Assigned to specialized maintenance personnel"
  },
  Inspection: {
    label: "Inspection",
    badge: "bg-cyan-50 text-cyan-700 border-cyan-200",
    dot: "bg-cyan-500",
    description: "Technician evaluating fault on site"
  },
  "In Progress": {
    label: "In Progress",
    badge: "bg-purple-50 text-purple-700 border-purple-200",
    dot: "bg-purple-600",
    description: "Active repair work underway"
  },
  "Awaiting Parts": {
    label: "Awaiting Parts",
    badge: "bg-orange-50 text-orange-700 border-orange-200",
    dot: "bg-orange-500",
    description: "Spare parts requisitioned from Central Stores"
  },
  "Repair Completed": {
    label: "Repair Completed",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    description: "Work finished by technician, pending QA/user check"
  },
  Resolved: {
    label: "Resolved",
    badge: "bg-green-50 text-green-700 border-green-200",
    dot: "bg-green-600",
    description: "Confirmed operational by requester"
  },
  Completed: {
    label: "Completed",
    badge: "bg-emerald-900 text-emerald-100 border-emerald-800",
    dot: "bg-emerald-400",
    description: "Fully documented and ticket archived"
  },
  Rejected: {
    label: "Rejected",
    badge: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
    description: "Declined with recorded justification"
  }
};

export const CAMPUS_LOCATIONS = [
  {
    faculty: "Faculty of Applied Science",
    departments: [
      {
        name: "Department of Physical Science",
        buildings: [
          {
            name: "Building A (Physical Science Complex)",
            floors: [
              { floor: "Ground Floor", rooms: ["Lecture Hall 01", "Physics Laboratory 01", "Physics Prep Room", "Restroom Block A-G"] },
              { floor: "1st Floor", rooms: ["Staff Room 101", "HOD Office 102", "Electronics Lab", "Computer Lab 01"] },
              { floor: "2nd Floor", rooms: ["Room 204 (Seminar Room)", "Research Scholar Lab", "Server Room A-2"] }
            ]
          }
        ]
      },
      {
        name: "Department of Bio-Science",
        buildings: [
          {
            name: "Building B (Biological Complex)",
            floors: [
              { floor: "Ground Floor", rooms: ["Botany Laboratory", "Zoology Museum", "Specimen Room"] },
              { floor: "1st Floor", rooms: ["Chemistry Laboratory", "Analytical Chemistry Lab", "Chemical Store"] }
            ]
          }
        ]
      }
    ]
  },
  {
    faculty: "Faculty of Technological Studies",
    departments: [
      {
        name: "Department of Information & Communication Technology",
        buildings: [
          {
            name: "Technology Complex Building 1",
            floors: [
              { floor: "1st Floor", rooms: ["Networking Lab", "Embedded Systems Lab", "Hardware Maintenance Lab"] },
              { floor: "2nd Floor", rooms: ["Computer Laboratory 02", "IoT Innovation Centre", "Staff Workstations"] }
            ]
          }
        ]
      },
      {
        name: "Department of Engineering Technology",
        buildings: [
          {
            name: "Mechanical & Civil Workshop Building",
            floors: [
              { floor: "Ground Floor", rooms: ["Machining Shop", "Welding Bay", "Thermodynamics Lab"] }
            ]
          }
        ]
      }
    ]
  },
  {
    faculty: "Faculty of Business Studies",
    departments: [
      {
        name: "Department of Management & Entrepreneurship",
        buildings: [
          {
            name: "Management Complex",
            floors: [
              { floor: "Ground Floor", rooms: ["Auditorium 01", "Student Service Counter"] },
              { floor: "1st Floor", rooms: ["Lecture Hall 03", "Case Study Discussion Room"] }
            ]
          }
        ]
      },
      {
        name: "Department of Accountancy & Finance",
        buildings: [
          {
            name: "Management Complex",
            floors: [
              { floor: "2nd Floor", rooms: ["Finance Lab", "Faculty Board Room"] }
            ]
          }
        ]
      }
    ]
  },
  {
    faculty: "Central Administration & Services",
    departments: [
      {
        name: "University Administration Complex",
        buildings: [
          {
            name: "Senate Building",
            floors: [
              { floor: "Ground Floor", rooms: ["Examination Division Room 12", "Bursar Office", "Accounts Division"] },
              { floor: "1st Floor", rooms: ["Vice Chancellor's Office", "Registrar Office", "Council Chamber"] }
            ]
          }
        ]
      },
      {
        name: "Library & Information Division",
        buildings: [
          {
            name: "Central Library Building",
            floors: [
              { floor: "Ground Floor", rooms: ["Circulation Desk Lobby", "E-Resource Centre", "Periodicals Room"] },
              { floor: "1st Floor", rooms: ["Main Reference Reading Hall", "Archives Section"] }
            ]
          }
        ]
      }
    ]
  }
];

export const TECHNICIANS_DIRECTORY = [
  {
    id: "tech-01",
    name: "N. Pathmanathan",
    email: "tech.electrical@vau.ac.lk",
    trade: "Electrical & HVAC",
    experience: "12 years",
    rating: 4.9,
    activeJobs: 3,
    status: "Available",
    phone: "+94 77 123 4567",
    specialties: ["Split AC Systems", "Distribution Panels", "Motor Controls"]
  },
  {
    id: "tech-02",
    name: "S. Kandeepan",
    email: "kandeepan.s@vau.ac.lk",
    trade: "Plumbing & Water Systems",
    experience: "8 years",
    rating: 4.8,
    activeJobs: 1,
    status: "Available",
    phone: "+94 77 234 5678",
    specialties: ["Laboratory Sinks", "Overhead Pressure Pumps", "Sewerage"]
  },
  {
    id: "tech-03",
    name: "R. Thuvaragan",
    email: "thuvaragan.r@vau.ac.lk",
    trade: "IT & Network Infrastructure",
    experience: "6 years",
    rating: 4.9,
    activeJobs: 2,
    status: "Busy",
    phone: "+94 77 345 6789",
    specialties: ["Structured Cabling", "Cisco Switches", "Projector Calibrations"]
  },
  {
    id: "tech-04",
    name: "K. Vigneshwaran",
    email: "vignesh.works@vau.ac.lk",
    trade: "Civil Works & Joinery",
    experience: "15 years",
    rating: 4.7,
    activeJobs: 4,
    status: "High Workload",
    phone: "+94 77 456 7890",
    specialties: ["Roof Waterproofing", "Door Closers & Locks", "Lab Cabinetry"]
  },
  {
    id: "tech-05",
    name: "J. Danushan",
    email: "danushan.j@vau.ac.lk",
    trade: "Air Conditioning Specialist",
    experience: "5 years",
    rating: 4.6,
    activeJobs: 2,
    status: "Available",
    phone: "+94 77 567 8901",
    specialties: ["Inverter Systems", "Gas Leak Detection", "Ductwork"]
  }
];

export const INITIAL_TICKETS = [
  {
    id: "MRS-2026-0148",
    title: "Air conditioner not cooling (Compressor tripping)",
    category: "Air Conditioning",
    faculty: "Faculty of Applied Science",
    department: "Department of Physical Science",
    building: "Building A (Physical Science Complex)",
    floor: "2nd Floor",
    room: "Room 204 (Seminar Room)",
    priority: "High",
    status: "In Progress",
    requester: {
      name: "Dr. K. Sivalingam",
      role: "Senior Lecturer Gr. I",
      email: "k.sivalingam@vau.ac.lk",
      phone: "+94 24 222 3311"
    },
    assignedTo: {
      id: "tech-01",
      name: "N. Pathmanathan",
      trade: "Electrical & HVAC",
      phone: "+94 77 123 4567"
    },
    submittedAt: "2026-09-18 09:30 AM",
    lastUpdated: "2026-09-19 10:15 AM",
    slaDue: "2026-09-19 09:30 PM (SLA On Track)",
    description: "The main 24,000 BTU split AC unit in Seminar Room 204 trips within 5 minutes of activation. The indoor blower runs, but outdoor compressor stops and error code E4 is indicated. The room gets excessively warm during 2-hour undergraduate lectures.",
    attachments: [
      { id: "att-1", name: "ac_unit_error_panel.jpg", size: "1.8 MB", type: "image/jpeg" },
      { id: "att-2", name: "room_204_indoor_unit.jpg", size: "2.4 MB", type: "image/jpeg" }
    ],
    timeline: [
      { status: "Submitted", time: "2026-09-18 09:30 AM", actor: "Dr. K. Sivalingam (Staff)", note: "Request submitted via online portal" },
      { status: "Department Review", time: "2026-09-18 10:15 AM", actor: "Prof. T. Ramanathan (HOD)", note: "Verified issue urgency for seminar schedules" },
      { status: "Approved", time: "2026-09-18 10:45 AM", actor: "Prof. T. Ramanathan (HOD)", note: "Approved with High Priority classification" },
      { status: "Assigned", time: "2026-09-18 11:20 AM", actor: "Works Division Dispatcher", note: "Assigned to N. Pathmanathan (HVAC Specialist)" },
      { status: "Inspection", time: "2026-09-18 02:00 PM", actor: "N. Pathmanathan (Technician)", note: "Diagnosed run capacitor failure & low R410A refrigerant" },
      { status: "Awaiting Parts", time: "2026-09-18 03:30 PM", actor: "N. Pathmanathan (Technician)", note: "Requested 45uF capacitor & 1kg R410A from Central Stores" },
      { status: "In Progress", time: "2026-09-19 09:00 AM", actor: "N. Pathmanathan (Technician)", note: "Parts issued from store; replacing capacitor on roof plant" }
    ],
    diagnosisNotes: "Checked electrical terminal. Dual run capacitor (45uF + 5uF) has bulged and degraded to 12uF, causing thermal overload switch in hermetic compressor to trip. Suction pressure is also slightly below spec (105 PSI vs 125 PSI expected).",
    checklist: [
      { task: "Isolate main power breaker at distribution board", done: true },
      { task: "Measure terminal voltage and compressor winding resistances", done: true },
      { task: "Test run capacitor capacitance using multimeter", done: true },
      { task: "Check refrigerant operating pressures (High/Low side)", done: true },
      { task: "Install replacement dual capacitor (45uF/450V)", done: true },
      { task: "Test 30-minute continuous cooling load run", done: false },
      { task: "Clean air filters and wash indoor evaporator coil", done: false }
    ],
    itemRequests: [
      { itemId: "INV-CAP-45", name: "Dual Motor Run Capacitor 45uF/450VAC", quantity: 1, status: "Issued", date: "2026-09-18" },
      { itemId: "INV-GAS-R410A", name: "R410A Refrigerant Gas (Cylinder Refill)", quantity: "1.2 kg", status: "Issued", date: "2026-09-18" }
    ],
    comments: [
      {
        id: "c-1",
        author: "Dr. K. Sivalingam",
        role: "Requester",
        time: "2026-09-18 09:35 AM",
        text: "Please note that tomorrow (Sept 19) at 2:00 PM we have a guest seminar scheduled in this hall with 45 attendees."
      },
      {
        id: "c-2",
        author: "Prof. T. Ramanathan",
        role: "Department Head",
        time: "2026-09-18 10:46 AM",
        text: "Flagged as urgent for prompt attention ahead of the faculty seminar."
      },
      {
        id: "c-3",
        author: "N. Pathmanathan",
        role: "Technician",
        time: "2026-09-19 10:15 AM",
        text: "Capacitor replaced. Currently charging refrigerant and monitoring compressor amp draw (currently steady at 8.2A). System will be completely ready by 12:30 PM."
      }
    ]
  },
  {
    id: "MRS-2026-0142",
    title: "Water leakage near laboratory sink 04",
    category: "Plumbing & Water",
    faculty: "Faculty of Applied Science",
    department: "Department of Bio-Science",
    building: "Building B (Biological Complex)",
    floor: "1st Floor",
    room: "Chemistry Laboratory",
    priority: "Urgent",
    status: "Assigned",
    requester: {
      name: "Dr. M. Nilakshi",
      role: "Head of Bio-Science",
      email: "m.nilakshi@vau.ac.lk",
      phone: "+94 24 222 3410"
    },
    assignedTo: {
      id: "tech-02",
      name: "S. Kandeepan",
      trade: "Plumbing & Water Systems",
      phone: "+94 77 234 5678"
    },
    submittedAt: "2026-09-19 08:15 AM",
    lastUpdated: "2026-09-19 09:00 AM",
    slaDue: "2026-09-19 12:15 PM (Urgent 4h SLA)",
    description: "The flexible connector tube under chemical wash sink #4 has ruptured. Water is pooling under the reagent cabinet, posing safety hazard to glassware and chemical bottles.",
    attachments: [
      { id: "att-3", name: "sink_leak_under_counter.jpg", size: "3.1 MB", type: "image/jpeg" }
    ],
    timeline: [
      { status: "Submitted", time: "2026-09-19 08:15 AM", actor: "Dr. M. Nilakshi (Staff)", note: "Emergency water leak flagged" },
      { status: "Approved", time: "2026-09-19 08:30 AM", actor: "Dean Office / Fast-track", note: "Immediate safety escalation" },
      { status: "Assigned", time: "2026-09-19 09:00 AM", actor: "Works Division Dispatcher", note: "Assigned to S. Kandeepan with stop-cock shutoff order" }
    ],
    diagnosisNotes: "Main angle valve shut off temporarily. Braided stainless steel flex pipe burst at crimp junction due to pressure surge.",
    checklist: [
      { task: "Turn off sub-isolation valve for sink 04", done: true },
      { task: "Mop and dry chemical containment area", done: true },
      { task: "Procure 1/2 inch x 450mm stainless steel braided hose", done: false },
      { task: "Replace flex hose and install new Teflon seal tape", done: false }
    ],
    itemRequests: [
      { itemId: "INV-PLB-HOSE45", name: "SS Braided Flexible Hose 1/2 inch x 450mm", quantity: 2, status: "Pending", date: "2026-09-19" }
    ],
    comments: [
      {
        id: "c-4",
        author: "S. Kandeepan",
        role: "Technician",
        time: "2026-09-19 09:10 AM",
        text: "Isolation valve closed. No further water flow. Sourcing replacement hose from Central Stores now."
      }
    ]
  },
  {
    id: "MRS-2026-0155",
    title: "Main entrance glass door closer arm loose",
    category: "Civil Works",
    faculty: "Central Administration & Services",
    department: "Library & Information Division",
    building: "Central Library Building",
    floor: "Ground Floor",
    room: "Circulation Desk Lobby",
    priority: "Medium",
    status: "Pending Review",
    requester: {
      name: "Mrs. S. Priyadharshini",
      role: "Assistant Librarian",
      email: "s.priya@vau.ac.lk",
      phone: "+94 24 222 4500"
    },
    assignedTo: null,
    submittedAt: "2026-09-19 11:20 AM",
    lastUpdated: "2026-09-19 11:20 AM",
    slaDue: "2026-09-20 11:20 AM",
    description: "The hydraulic overhead door closer on the heavy double glass doors at the library main entrance has lost pressure. The door slams heavily with wind gusts, which poses a safety risk for students.",
    attachments: [
      { id: "att-4", name: "door_closer_joint.jpg", size: "1.2 MB", type: "image/jpeg" }
    ],
    timeline: [
      { status: "Submitted", time: "2026-09-19 11:20 AM", actor: "Mrs. S. Priyadharshini (Staff)", note: "Submitted for departmental verification" }
    ],
    diagnosisNotes: "",
    checklist: [],
    itemRequests: [],
    comments: []
  },
  {
    id: "MRS-2026-0137",
    title: "Network ports not functioning (Ports 14-16)",
    category: "IT Infrastructure",
    faculty: "Faculty of Technological Studies",
    department: "Department of Information & Communication Technology",
    building: "Technology Complex Building 1",
    floor: "2nd Floor",
    room: "Computer Laboratory 02",
    priority: "Medium",
    status: "Resolved",
    requester: {
      name: "Mr. T. Saravanan",
      role: "Lecturer (Probationary)",
      email: "t.saravanan@vau.ac.lk",
      phone: "+94 24 222 3600"
    },
    assignedTo: {
      id: "tech-03",
      name: "R. Thuvaragan",
      trade: "IT & Network Infrastructure",
      phone: "+94 77 345 6789"
    },
    submittedAt: "2026-09-17 02:10 PM",
    lastUpdated: "2026-09-18 04:40 PM",
    slaDue: "2026-09-18 02:10 PM",
    description: "Data wall outlets #14, 15, and 16 on workstation bench C have no link light. Students are unable to connect lab computers to the campus subnet during networking practicals.",
    attachments: [
      { id: "att-5", name: "patch_panel_rack_b.jpg", size: "2.1 MB", type: "image/jpeg" }
    ],
    timeline: [
      { status: "Submitted", time: "2026-09-17 02:10 PM", actor: "Mr. T. Saravanan (Staff)", note: "Logged ticket" },
      { status: "Approved", time: "2026-09-17 02:40 PM", actor: "HOD ICT", note: "Approved" },
      { status: "Assigned", time: "2026-09-17 03:00 PM", actor: "Works Division", note: "Assigned to R. Thuvaragan" },
      { status: "In Progress", time: "2026-09-18 09:30 AM", actor: "R. Thuvaragan", note: "Tracing patch cord in server rack B" },
      { status: "Repair Completed", time: "2026-09-18 03:30 PM", actor: "R. Thuvaragan", note: "Re-terminated keystone jacks and replaced damaged Cat6 patch cables" },
      { status: "Resolved", time: "2026-09-18 04:40 PM", actor: "Mr. T. Saravanan", note: "Work confirmed and verified by requester" }
    ],
    diagnosisNotes: "Rats had chewed through Cat6 cable sheath behind trunking. Keystone jacks at bench faceplate were oxidized. Re-punched connections and verified 1Gbps full duplex link test with Fluke cable tester.",
    checklist: [
      { task: "Tone & trace patch panel ports 14-16 to Switch 03", done: true },
      { task: "Check PoE and continuity on all 8 pins", done: true },
      { task: "Re-punch RJ45 keystone modules", done: true },
      { task: "Run throughput test on client workstations", done: true }
    ],
    itemRequests: [
      { itemId: "INV-NET-CAT6", name: "Cat6 RJ45 Keystone Jack Modules", quantity: 3, status: "Issued", date: "2026-09-18" },
      { itemId: "INV-NET-PATCH2M", name: "Molded Cat6 Patch Cord 2-meter", quantity: 3, status: "Issued", date: "2026-09-18" }
    ],
    comments: [
      {
        id: "c-5",
        author: "R. Thuvaragan",
        role: "Technician",
        time: "2026-09-18 03:35 PM",
        text: "Tested all 3 stations with DHCP and internet connectivity verified. Clean speed test 940 Mbps."
      },
      {
        id: "c-6",
        author: "Mr. T. Saravanan",
        role: "Requester",
        time: "2026-09-18 04:40 PM",
        text: "Confirmed! Practical class ran smoothly this afternoon. Thank you for the quick resolution."
      }
    ]
  },
  {
    id: "MRS-2026-0150",
    title: "Overhead projector power supply intermittent",
    category: "IT Infrastructure",
    faculty: "Faculty of Business Studies",
    department: "Department of Management & Entrepreneurship",
    building: "Management Complex",
    floor: "1st Floor",
    room: "Lecture Hall 03",
    priority: "High",
    status: "Awaiting Parts",
    requester: {
      name: "Prof. A. Pushparajah",
      role: "Dean / Faculty of Business",
      email: "dean.fbs@vau.ac.lk",
      phone: "+94 24 222 5100"
    },
    assignedTo: {
      id: "tech-03",
      name: "R. Thuvaragan",
      trade: "IT & Network Infrastructure",
      phone: "+94 77 345 6789"
    },
    submittedAt: "2026-09-18 11:00 AM",
    lastUpdated: "2026-09-19 10:00 AM",
    slaDue: "2026-09-19 11:00 AM (Awaiting Stock)",
    description: "Ceiling-mounted Epson EB-X51 projector shuts down with orange lamp indicator blinking after 10 minutes. Filter is cleaned; internal ballast/lamp power supply unit needs replacement.",
    attachments: [],
    timeline: [
      { status: "Submitted", time: "2026-09-18 11:00 AM", actor: "Prof. A. Pushparajah", note: "Logged issue" },
      { status: "Approved", time: "2026-09-18 11:30 AM", actor: "HOD Management", note: "Approved" },
      { status: "Assigned", time: "2026-09-18 01:15 PM", actor: "Works Division", note: "Assigned to R. Thuvaragan" },
      { status: "Inspection", time: "2026-09-18 03:00 PM", actor: "R. Thuvaragan", note: "Lamp runtime exceeded 5,800 hours. Replacement lamp required." },
      { status: "Awaiting Parts", time: "2026-09-19 09:30 AM", actor: "R. Thuvaragan", note: "Requisitioned ELPLP97 replacement lamp from stores (PO pending)" }
    ],
    diagnosisNotes: "UHE 210W lamp module past service life. Projector overheating auto-cutoff activated.",
    checklist: [
      { task: "Inspect cooling fan and optical path dust", done: true },
      { task: "Check lamp operating counter (logged 5,842 hrs)", done: true },
      { task: "Procure compatible ELPLP97 replacement bulb assembly", done: false }
    ],
    itemRequests: [
      { itemId: "INV-PRJ-ELPLP97", name: "Epson ELPLP97 Replacement Projector Lamp", quantity: 1, status: "Awaiting Purchase", date: "2026-09-19" }
    ],
    comments: [
      {
        id: "c-7",
        author: "M. Fernando",
        role: "Store Keeper",
        time: "2026-09-19 10:00 AM",
        text: "Stock is zero for ELPLP97. Emergency purchase order #PO-2026-89 forwarded to Bursar Division."
      }
    ]
  },
  {
    id: "MRS-2026-0153",
    title: "Fluorescent tube flickering & burning smell",
    category: "Electrical",
    faculty: "Central Administration & Services",
    department: "University Administration Complex",
    building: "Senate Building",
    floor: "Ground Floor",
    room: "Examination Division Room 12",
    priority: "Urgent",
    status: "Inspection",
    requester: {
      name: "Mr. P. Vigneswaran",
      role: "Senior Assistant Registrar",
      email: "sar.exam@vau.ac.lk",
      phone: "+94 24 222 2212"
    },
    assignedTo: {
      id: "tech-01",
      name: "N. Pathmanathan",
      trade: "Electrical & HVAC",
      phone: "+94 77 123 4567"
    },
    submittedAt: "2026-09-19 09:40 AM",
    lastUpdated: "2026-09-19 10:30 AM",
    slaDue: "2026-09-19 01:40 PM (Urgent)",
    description: "Overhead light fixture 3 in Exam confidential room is emitting an acrid burning plastic smell and buzzing loudly. Switched off at local switchboard.",
    attachments: [],
    timeline: [
      { status: "Submitted", time: "2026-09-19 09:40 AM", actor: "Mr. P. Vigneswaran", note: "Urgent electrical alert" },
      { status: "Approved", time: "2026-09-19 09:50 AM", actor: "Registrar Division", note: "Immediate electrical approval" },
      { status: "Assigned", time: "2026-09-19 10:00 AM", actor: "Works Division", note: "Dispatched N. Pathmanathan" },
      { status: "Inspection", time: "2026-09-19 10:30 AM", actor: "N. Pathmanathan", note: "Magnetic ballast melted; converting to direct 18W LED tube" }
    ],
    diagnosisNotes: "Old copper electromagnetic ballast suffered insulation breakdown and overheated. Upgrading the 2x36W fitting to T8 LED tubes, bypassing the ballast entirely.",
    checklist: [
      { task: "Verify circuit isolation using non-contact voltage pen", done: true },
      { task: "Remove defective magnetic ballast and starter", done: true },
      { task: "Rewire luminaire for single-ended LED T8 operation", done: false },
      { task: "Install 2x 18W Daylight LED tubes", done: false }
    ],
    itemRequests: [
      { itemId: "INV-ELE-LEDT8", name: "Philips 18W T8 LED Tube 4000K", quantity: 2, status: "Issued", date: "2026-09-19" }
    ],
    comments: []
  },
  {
    id: "MRS-2026-0160",
    title: "Broken wooden armrest on student chair set (Row 4)",
    category: "Furniture & Fittings",
    faculty: "Faculty of Applied Science",
    department: "Department of Physical Science",
    building: "Building A (Physical Science Complex)",
    floor: "Ground Floor",
    room: "Lecture Hall 01",
    priority: "Low",
    status: "Submitted",
    requester: {
      name: "Dr. K. Sivalingam",
      role: "Senior Lecturer Gr. I",
      email: "k.sivalingam@vau.ac.lk",
      phone: "+94 24 222 3311"
    },
    assignedTo: null,
    submittedAt: "2026-09-19 11:45 AM",
    lastUpdated: "2026-09-19 11:45 AM",
    slaDue: "2026-09-22 11:45 AM",
    description: "The writing armrest on seat 4-B in Lecture Hall 01 has split along the timber grain. Minor splinter risk for students taking notes.",
    attachments: [],
    timeline: [
      { status: "Submitted", time: "2026-09-19 11:45 AM", actor: "Dr. K. Sivalingam", note: "Logged by academic staff" }
    ],
    diagnosisNotes: "",
    checklist: [],
    itemRequests: [],
    comments: []
  },
  {
    id: "MRS-2026-0128",
    title: "Duplicate report: AC unit in seminar room warm",
    category: "Air Conditioning",
    faculty: "Faculty of Applied Science",
    department: "Department of Physical Science",
    building: "Building A (Physical Science Complex)",
    floor: "2nd Floor",
    room: "Room 204 (Seminar Room)",
    priority: "Medium",
    status: "Rejected",
    requester: {
      name: "Dr. K. Sivalingam",
      role: "Senior Lecturer Gr. I",
      email: "k.sivalingam@vau.ac.lk",
      phone: "+94 24 222 3311"
    },
    assignedTo: null,
    submittedAt: "2026-09-18 10:10 AM",
    lastUpdated: "2026-09-18 10:30 AM",
    slaDue: "N/A",
    description: "AC not chilling properly.",
    attachments: [],
    rejectionReason: "Duplicate request. Issue is already logged and currently active under MRS-2026-0148 with specialized HVAC technician assigned.",
    timeline: [
      { status: "Submitted", time: "2026-09-18 10:10 AM", actor: "Dr. K. Sivalingam", note: "Logged" },
      { status: "Rejected", time: "2026-09-18 10:30 AM", actor: "Prof. T. Ramanathan (HOD)", note: "Rejected as duplicate of MRS-2026-0148" }
    ],
    diagnosisNotes: "",
    checklist: [],
    itemRequests: [],
    comments: []
  }
];
