export const INITIAL_USERS = [
  {
    id: "usr-01",
    name: "Dr. K. Sivalingam",
    email: "k.sivalingam@vau.ac.lk",
    role: "general_user",
    roleLabel: "General User / Staff",
    department: "Department of Physical Science",
    faculty: "Faculty of Applied Science",
    status: "Active",
    lastLogin: "2026-09-19 11:30 AM",
    phone: "+94 24 222 3311"
  },
  {
    id: "usr-02",
    name: "Prof. T. Ramanathan",
    email: "hod.physical@vau.ac.lk",
    role: "dept_admin",
    roleLabel: "Department Admin / HOD",
    department: "Department of Physical Science",
    faculty: "Faculty of Applied Science",
    status: "Active",
    lastLogin: "2026-09-19 10:45 AM",
    phone: "+94 24 222 3300"
  },
  {
    id: "usr-03",
    name: "N. Pathmanathan",
    email: "tech.electrical@vau.ac.lk",
    role: "technician",
    roleLabel: "Technician / Specialist",
    department: "Works & Maintenance Division",
    faculty: "Central Facilities",
    status: "Active",
    lastLogin: "2026-09-19 09:00 AM",
    phone: "+94 77 123 4567"
  },
  {
    id: "usr-04",
    name: "M. Fernando",
    email: "stores@vau.ac.lk",
    role: "store_keeper",
    roleLabel: "Store Keeper / Inventory",
    department: "Central Maintenance Stores",
    faculty: "Administration & Stores",
    status: "Active",
    lastLogin: "2026-09-19 08:15 AM",
    phone: "+94 24 222 4110"
  },
  {
    id: "usr-05",
    name: "S. Wijesinghe",
    email: "admin.it@vau.ac.lk",
    role: "super_admin",
    roleLabel: "System Super Admin",
    department: "IT Centre & Administration",
    faculty: "University Administration",
    status: "Active",
    lastLogin: "2026-09-19 11:55 AM",
    phone: "+94 24 222 0001"
  },
  {
    id: "usr-06",
    name: "Dr. M. Nilakshi",
    email: "m.nilakshi@vau.ac.lk",
    role: "dept_admin",
    roleLabel: "Department Admin / HOD",
    department: "Department of Bio-Science",
    faculty: "Faculty of Applied Science",
    status: "Active",
    lastLogin: "2026-09-19 08:30 AM",
    phone: "+94 24 222 3410"
  },
  {
    id: "usr-07",
    name: "Prof. A. Pushparajah",
    email: "dean.fbs@vau.ac.lk",
    role: "dept_admin",
    roleLabel: "Dean / Senior Admin",
    department: "Faculty of Business Studies",
    faculty: "Faculty of Business Studies",
    status: "Active",
    lastLogin: "2026-09-18 11:20 AM",
    phone: "+94 24 222 5100"
  },
  {
    id: "usr-08",
    name: "S. Kandeepan",
    email: "kandeepan.s@vau.ac.lk",
    role: "technician",
    roleLabel: "Technician / Specialist",
    department: "Works & Maintenance Division",
    faculty: "Central Facilities",
    status: "Active",
    lastLogin: "2026-09-19 09:12 AM",
    phone: "+94 77 234 5678"
  },
  {
    id: "usr-09",
    name: "R. Thuvaragan",
    email: "thuvaragan.r@vau.ac.lk",
    role: "technician",
    roleLabel: "Technician / Specialist",
    department: "Works & Maintenance Division",
    faculty: "Central Facilities",
    status: "Active",
    lastLogin: "2026-09-19 09:25 AM",
    phone: "+94 77 345 6789"
  },
  {
    id: "usr-10",
    name: "Mrs. S. Priyadharshini",
    email: "s.priya@vau.ac.lk",
    role: "general_user",
    roleLabel: "General User / Staff",
    department: "Library & Information Division",
    faculty: "Central Administration",
    status: "Active",
    lastLogin: "2026-09-19 11:15 AM",
    phone: "+94 24 222 4500"
  }
];

export const PERMISSION_MATRIX = [
  { module: "Create Maintenance Requests", staff: true, deptAdmin: true, technician: false, storeKeeper: false, superAdmin: true },
  { module: "View Own Requests & Progress", staff: true, deptAdmin: true, technician: true, storeKeeper: true, superAdmin: true },
  { module: "Review & Verify Department Requests", staff: false, deptAdmin: true, technician: false, storeKeeper: false, superAdmin: true },
  { module: "Reject Requests with Reason", staff: false, deptAdmin: true, technician: false, storeKeeper: false, superAdmin: true },
  { module: "Change Request Priority", staff: false, deptAdmin: true, technician: false, storeKeeper: false, superAdmin: true },
  { module: "Assign Technicians to Work Orders", staff: false, deptAdmin: true, technician: false, storeKeeper: false, superAdmin: true },
  { module: "Execute & Update Assigned Tasks", staff: false, deptAdmin: false, technician: true, storeKeeper: false, superAdmin: true },
  { module: "Submit Inspection & Checklist", staff: false, deptAdmin: false, technician: true, storeKeeper: false, superAdmin: true },
  { module: "Requisition Spare Parts from Stores", staff: false, deptAdmin: false, technician: true, storeKeeper: false, superAdmin: true },
  { module: "Approve & Issue Inventory Parts", staff: false, deptAdmin: false, technician: false, storeKeeper: true, superAdmin: true },
  { module: "Manage Stock & Reorder Points", staff: false, deptAdmin: false, technician: false, storeKeeper: true, superAdmin: true },
  { module: "Confirm Completed Work (Requester)", staff: true, deptAdmin: true, technician: false, storeKeeper: false, superAdmin: true },
  { module: "Department Reports & Velocity", staff: false, deptAdmin: true, technician: false, storeKeeper: false, superAdmin: true },
  { module: "Campus-wide Analytics & SLA Stats", staff: false, deptAdmin: false, technician: false, storeKeeper: false, superAdmin: true },
  { module: "User & Role Administration", staff: false, deptAdmin: false, technician: false, storeKeeper: false, superAdmin: true },
  { module: "Locations & Hierarchy Config", staff: false, deptAdmin: false, technician: false, storeKeeper: false, superAdmin: true },
  { module: "Security & System Audit Logs", staff: false, deptAdmin: false, technician: false, storeKeeper: false, superAdmin: true }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: "LOG-9081",
    timestamp: "2026-09-19 11:45:12 AM",
    user: "Dr. K. Sivalingam",
    userRole: "General Staff",
    action: "CREATE_TICKET",
    module: "Requests",
    target: "MRS-2026-0160",
    ip: "192.248.64.12",
    device: "Chrome 128 / macOS (Campus Wi-Fi)",
    details: "Logged new furniture maintenance request for Lecture Hall 01"
  },
  {
    id: "LOG-9080",
    timestamp: "2026-09-19 10:40:02 AM",
    user: "M. Fernando",
    userRole: "Store Keeper",
    action: "ISSUE_STOCK",
    module: "Inventory",
    target: "REQ-2026-086 / ELE-LED-T8-18W",
    ip: "192.248.64.44",
    device: "Firefox 129 / Windows 11 (Stores Desktop)",
    details: "Dispatched 2 units of 18W LED tubes for Exam Division urgent work order"
  },
  {
    id: "LOG-9079",
    timestamp: "2026-09-19 10:15:30 AM",
    user: "N. Pathmanathan",
    userRole: "Technician",
    action: "UPDATE_STATUS",
    module: "Tasks",
    target: "MRS-2026-0148",
    ip: "192.248.68.105",
    device: "Safari Mobile / iOS (Field iPad)",
    details: "Changed status to In Progress and updated diagnostic checklist"
  },
  {
    id: "LOG-9078",
    timestamp: "2026-09-19 09:00:15 AM",
    user: "Prof. T. Ramanathan",
    userRole: "Department Admin",
    action: "ASSIGN_TECHNICIAN",
    module: "Work Orders",
    target: "MRS-2026-0142",
    ip: "192.248.64.18",
    device: "Chrome 128 / Windows 11 (HOD Office)",
    details: "Assigned technician S. Kandeepan with Urgent priority tag"
  },
  {
    id: "LOG-9077",
    timestamp: "2026-09-18 10:30:45 AM",
    user: "Prof. T. Ramanathan",
    userRole: "Department Admin",
    action: "REJECT_TICKET",
    module: "Work Orders",
    target: "MRS-2026-0128",
    ip: "192.248.64.18",
    device: "Chrome 128 / Windows 11",
    details: "Rejected ticket: Duplicate of active work order MRS-2026-0148"
  },
  {
    id: "LOG-9076",
    timestamp: "2026-09-18 08:15:00 AM",
    user: "S. Wijesinghe",
    userRole: "Super Admin",
    action: "UPDATE_SLA_POLICY",
    module: "Workflow Settings",
    target: "SLA Matrix v2.4",
    ip: "192.248.64.02",
    device: "Edge 128 / Windows 11",
    details: "Adjusted Urgent ticket first-response SLA to 2 hours university-wide"
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-01",
    category: "Requests",
    title: "Request Status Updated to In Progress",
    message: "Technician N. Pathmanathan has started active repair work on your ticket MRS-2026-0148 (Seminar Room 204 AC).",
    timestamp: "15 minutes ago",
    ticketId: "MRS-2026-0148",
    unread: true,
    roleTarget: "general_user"
  },
  {
    id: "notif-02",
    category: "Approvals",
    title: "New Maintenance Request Awaiting Review",
    message: "A new Civil Works request MRS-2026-0155 (Library entrance door) was submitted and requires verification.",
    timestamp: "45 minutes ago",
    ticketId: "MRS-2026-0155",
    unread: true,
    roleTarget: "dept_admin"
  },
  {
    id: "notif-03",
    category: "Assignments",
    title: "New Urgent Task Assigned",
    message: "You have been assigned to urgent plumbing ticket MRS-2026-0142 (Chemistry Lab sink leak).",
    timestamp: "2 hours ago",
    ticketId: "MRS-2026-0142",
    unread: false,
    roleTarget: "technician"
  },
  {
    id: "notif-04",
    category: "Inventory",
    title: "New Spare Part Requisition",
    message: "Technician S. Kandeepan requested 2 units of SS Braided Hose for ticket MRS-2026-0142.",
    timestamp: "2 hours ago",
    ticketId: "MRS-2026-0142",
    unread: true,
    roleTarget: "store_keeper"
  },
  {
    id: "notif-05",
    category: "Inventory",
    title: "Critical Stock Alert: Projector Lamp",
    message: "Stock for Epson ELPLP97 has dropped to 0 units (Reorder point: 2).",
    timestamp: "3 hours ago",
    ticketId: "MRS-2026-0150",
    unread: true,
    roleTarget: "store_keeper"
  },
  {
    id: "notif-06",
    category: "System",
    title: "Scheduled Maintenance Window",
    message: "Campus central generator load test scheduled for Saturday 21 Sept, 06:00 - 08:00 AM.",
    timestamp: "1 day ago",
    ticketId: null,
    unread: false,
    roleTarget: "all"
  }
];
