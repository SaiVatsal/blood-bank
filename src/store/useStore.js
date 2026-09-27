import { create } from 'zustand';

export const useStore = create((set, get) => ({
  activeTab: 'inventory', // 'inventory' | 'donors' | 'requests' | 'register-donor'
  selectedBloodFilter: 'All',

  inventory: [
    { type: 'O-', units: 8, status: 'Critical Low', target: 35, shelfLifeDays: 28, universalDonor: true },
    { type: 'O+', units: 42, status: 'Adequate', target: 50, shelfLifeDays: 32, universalDonor: false },
    { type: 'A-', units: 11, status: 'Low Stock', target: 25, shelfLifeDays: 30, universalDonor: false },
    { type: 'A+', units: 58, status: 'Optimal', target: 50, shelfLifeDays: 35, universalDonor: false },
    { type: 'B-', units: 6, status: 'Critical Low', target: 20, shelfLifeDays: 25, universalDonor: false },
    { type: 'B+', units: 34, status: 'Adequate', target: 40, shelfLifeDays: 34, universalDonor: false },
    { type: 'AB-', units: 4, status: 'Critical Low', target: 15, shelfLifeDays: 22, universalDonor: false },
    { type: 'AB+', units: 22, status: 'Adequate', target: 20, shelfLifeDays: 38, universalDonor: false }
  ],

  donors: [
    {
      id: 'DNR-801',
      name: 'Marcus Vance',
      bloodType: 'O-',
      phone: '+1 (555) 234-9982',
      lastDonatedDate: 'Jul 15, 2026',
      daysUntilEligible: 0, // Eligible now
      totalDonations: 12,
      location: 'Downtown Center',
      verified: true
    },
    {
      id: 'DNR-802',
      name: 'Elena Rostova',
      bloodType: 'B-',
      phone: '+1 (555) 839-1022',
      lastDonatedDate: 'Aug 28, 2026',
      daysUntilEligible: 24, // In cooldown
      totalDonations: 6,
      location: 'North Bay Regional',
      verified: true
    },
    {
      id: 'DNR-803',
      name: 'Dr. Kevin Chen',
      bloodType: 'AB-',
      phone: '+1 (555) 912-4411',
      lastDonatedDate: 'Jun 10, 2026',
      daysUntilEligible: 0,
      totalDonations: 18,
      location: 'University Medical Hub',
      verified: true
    }
  ],

  hospitalRequests: [
    {
      id: 'REQ-401',
      hospital: 'St. Jude Trauma Center ICU',
      bloodType: 'O-',
      unitsRequested: 6,
      urgency: 'Emergency STAT',
      department: 'Trauma Bay 1 (Severe Hemorrhage)',
      status: 'Pending Dispatch', // 'Pending Dispatch' | 'Dispatched' | 'Fulfilled'
      timeRequested: '15 mins ago'
    },
    {
      id: 'REQ-402',
      hospital: 'Memorial Children Hospital',
      bloodType: 'B-',
      unitsRequested: 3,
      urgency: 'Urgent (2hr)',
      department: 'Pediatric Oncology Unit',
      status: 'Fulfilled',
      timeRequested: '2 hours ago'
    }
  ],

  broadcasts: [],

  // Actions
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedBloodFilter: (b) => set({ selectedBloodFilter: b }),

  fulfillHospitalRequest: (requestId) => set((state) => {
    const req = state.hospitalRequests.find(r => r.id === requestId);
    if (!req) return state;

    // Deduct from inventory
    const updatedInventory = state.inventory.map(item => {
      if (item.type === req.bloodType) {
        const remaining = Math.max(0, item.units - req.unitsRequested);
        return {
          ...item,
          units: remaining,
          status: remaining < 10 ? 'Critical Low' : remaining < 25 ? 'Low Stock' : 'Adequate'
        };
      }
      return item;
    });

    const updatedRequests = state.hospitalRequests.map(r =>
      r.id === requestId ? { ...r, status: 'Fulfilled' } : r
    );

    return {
      inventory: updatedInventory,
      hospitalRequests: updatedRequests
    };
  }),

  registerDonor: (donorData) => set((state) => {
    const newDonor = {
      id: `DNR-${Math.floor(804 + Math.random() * 900)}`,
      daysUntilEligible: 0,
      totalDonations: 0,
      verified: true,
      ...donorData
    };
    return {
      donors: [newDonor, ...state.donors],
      activeTab: 'donors'
    };
  }),

  broadcastUrgentAlert: (bloodType) => set((state) => {
    const matchingDonors = state.donors.filter(d => d.bloodType === bloodType && d.daysUntilEligible === 0);
    const newBroadcast = {
      id: `BC-${Date.now()}`,
      bloodType,
      recipientsCount: matchingDonors.length,
      time: 'Just now',
      message: `CRITICAL STAT CALL: Urgent ${bloodType} shortage. ${matchingDonors.length} eligible donors alerted via SMS.`
    };
    return {
      broadcasts: [newBroadcast, ...state.broadcasts]
    };
  })
}));
