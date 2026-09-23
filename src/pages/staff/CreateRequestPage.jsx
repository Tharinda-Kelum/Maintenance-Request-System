import React, { useState } from 'react';
import {
  Zap,
  Wind,
  Droplets,
  Server,
  Hammer,
  Armchair,
  Wifi,
  ShieldAlert,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  ArrowLeft,
  FileText,
  MapPin,
  Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTickets } from '../../context/TicketContext';
import { CATEGORIES, PRIORITIES, CAMPUS_LOCATIONS } from '../../data/mockData';

export const CreateRequestPage = ({ onNavigate, onSelectTicket }) => {
  const { currentUser } = useAuth();
  const { createTicket } = useTickets();

  // Multi-section step state
  const [currentStep, setCurrentStep] = useState(1);

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Air Conditioning');
  const [priority, setPriority] = useState('High');
  const [description, setDescription] = useState('');

  // Location Fields (Dependent Dropdowns)
  const [faculty, setFaculty] = useState(CAMPUS_LOCATIONS[0].faculty);
  const [department, setDepartment] = useState(CAMPUS_LOCATIONS[0].departments[0].name);
  const [building, setBuilding] = useState(CAMPUS_LOCATIONS[0].departments[0].buildings[0].name);
  const [floor, setFloor] = useState(CAMPUS_LOCATIONS[0].departments[0].buildings[0].floors[0].floor);
  const [room, setRoom] = useState(CAMPUS_LOCATIONS[0].departments[0].buildings[0].floors[0].rooms[0]);
  const [locationNotes, setLocationNotes] = useState('');

  // Attachments
  const [attachments, setAttachments] = useState([
    { id: 'att-user-1', name: 'fault_photo_evidence.jpg', size: '1.4 MB', type: 'image/jpeg' }
  ]);

  // Submission result state
  const [submittedTicket, setSubmittedTicket] = useState(null);

  // Current faculty object
  const currentFacultyObj = CAMPUS_LOCATIONS.find((f) => f.faculty === faculty) || CAMPUS_LOCATIONS[0];
  const currentDeptObj = currentFacultyObj.departments.find((d) => d.name === department) || currentFacultyObj.departments[0];
  const currentBuildingObj = currentDeptObj.buildings.find((b) => b.name === building) || currentDeptObj.buildings[0];
  const currentFloorObj = currentBuildingObj.floors.find((fl) => fl.floor === floor) || currentBuildingObj.floors[0];

  const handleFacultyChange = (newFaculty) => {
    setFaculty(newFaculty);
    const fObj = CAMPUS_LOCATIONS.find((f) => f.faculty === newFaculty) || CAMPUS_LOCATIONS[0];
    const dObj = fObj.departments[0];
    const bObj = dObj.buildings[0];
    const flObj = bObj.floors[0];
    setDepartment(dObj.name);
    setBuilding(bObj.name);
    setFloor(flObj.floor);
    setRoom(flObj.rooms[0]);
  };

  const handleDepartmentChange = (newDept) => {
    setDepartment(newDept);
    const dObj = currentFacultyObj.departments.find((d) => d.name === newDept) || currentFacultyObj.departments[0];
    const bObj = dObj.buildings[0];
    const flObj = bObj.floors[0];
    setBuilding(bObj.name);
    setFloor(flObj.floor);
    setRoom(flObj.rooms[0]);
  };

  const handleBuildingChange = (newBuilding) => {
    setBuilding(newBuilding);
    const bObj = currentDeptObj.buildings.find((b) => b.name === newBuilding) || currentDeptObj.buildings[0];
    const flObj = bObj.floors[0];
    setFloor(flObj.floor);
    setRoom(flObj.rooms[0]);
  };

  const handleFloorChange = (newFloor) => {
    setFloor(newFloor);
    const flObj = currentBuildingObj.floors.find((fl) => fl.floor === newFloor) || currentBuildingObj.floors[0];
    setRoom(flObj.rooms[0]);
  };

  const handleAddMockFile = () => {
    const mockFiles = [
      { id: `att-${Date.now()}`, name: 'wiring_junction_box.jpg', size: '2.1 MB', type: 'image/jpeg' },
      { id: `att-${Date.now() + 1}`, name: 'breaker_panel_photo.png', size: '1.8 MB', type: 'image/png' },
      { id: `att-${Date.now() + 2}`, name: 'equipment_spec_sheet.pdf', size: '540 KB', type: 'application/pdf' }
    ];
    const nextFile = mockFiles[attachments.length % mockFiles.length];
    setAttachments([...attachments, nextFile]);
  };

  const handleRemoveAttachment = (id) => {
    setAttachments(attachments.filter((a) => a.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTicket = createTicket(
      {
        title,
        category,
        priority,
        description,
        faculty,
        department,
        building,
        floor,
        room: locationNotes ? `${room} (${locationNotes})` : room,
        attachments
      },
      currentUser
    );
    setSubmittedTicket(newTicket);
  };

  // If submitted, show confirmation modal/screen
  if (submittedTicket) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="bg-[#131926] rounded-2xl border border-[#1F293D] p-8 shadow-card text-center animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-[#bbf246]/15 text-[#a3e635] border border-[#a3e635]/30 flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(187,242,70,0.3)]">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#a3e635]">
            Submission Successful
          </span>
          <h2 className="text-2xl font-bold text-white mt-1">
            Maintenance Request Registered
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
            Your issue has been logged into the University of Vavuniya Maintenance Request System and routed to your Department Head for verification.
          </p>

          <div className="my-6 p-4 rounded-xl bg-[#0E131E] border border-[#1F293D] max-w-sm mx-auto text-left space-y-2.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Ticket Reference:</span>
              <span className="font-mono font-bold text-[#a3e635]">{submittedTicket.id}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Initial Status:</span>
              <span className="font-semibold text-sky-400">Submitted</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Target Response SLA:</span>
              <span className="font-mono text-white">{submittedTicket.slaDue}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Assigned Facility:</span>
              <span className="text-slate-200 font-medium truncate max-w-[180px]">{submittedTicket.room}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onSelectTicket(submittedTicket.id)}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#bbf246] hover:bg-[#a3e635] text-[#020617] text-xs font-bold rounded-full shadow-[0_0_16px_rgba(187,242,70,0.4)] transition-all"
            >
              View Ticket Status & Timeline
            </button>
            <button
              onClick={() => {
                setSubmittedTicket(null);
                setCurrentStep(1);
                setTitle('');
                setDescription('');
              }}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#0E131E] border border-[#1F293D] hover:bg-white/5 text-slate-200 text-xs font-semibold rounded-full transition-colors"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      </div>
    );
  }

  const categoryIcons = {
    Zap,
    Wind,
    Droplets,
    Server,
    Hammer,
    Armchair,
    Wifi,
    ShieldAlert
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-[#131926] p-6 rounded-2xl border border-[#1F293D] shadow-card">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Create Maintenance Request
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Provide details about the physical infrastructure or equipment fault so the maintenance team can respond efficiently.
        </p>

        {/* Stepper Progress Indicator */}
        <div className="mt-6 flex items-center justify-between border-t border-[#1F293D] pt-4">
          {[
            { num: 1, label: 'Issue Details' },
            { num: 2, label: 'Campus Location' },
            { num: 3, label: 'Photos & Evidence' },
            { num: 4, label: 'Review & Submit' }
          ].map((step) => (
            <div
              key={step.num}
              onClick={() => setCurrentStep(step.num)}
              className={`flex items-center gap-2 cursor-pointer ${
                currentStep === step.num
                  ? 'text-[#bbf246] font-bold'
                  : currentStep > step.num
                  ? 'text-[#a3e635] font-medium'
                  : 'text-slate-500'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all ${
                  currentStep === step.num
                    ? 'bg-[#bbf246] text-[#020617] ring-4 ring-[#bbf246]/25 font-extrabold shadow-[0_0_12px_rgba(187,242,70,0.4)]'
                    : currentStep > step.num
                    ? 'bg-[#a3e635]/20 text-[#a3e635] border border-[#a3e635]/40'
                    : 'bg-[#0E131E] text-slate-500 border border-[#1F293D]'
                }`}
              >
                {step.num}
              </div>
              <span className="hidden md:inline text-xs">{step.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Stepped Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* STEP 1: Issue Information */}
        {currentStep === 1 && (
          <div className="bg-[#131926] rounded-2xl border border-[#1F293D] p-6 shadow-card space-y-6 animate-in fade-in duration-150">
            <div>
              <h3 className="text-sm font-bold text-white">Section A — Issue Information</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Classify the physical defect and specify the severity of disruption.
              </p>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">
                Issue Summary / Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Air conditioner compressor tripping repeatedly in Seminar Room"
                className="w-full px-3.5 py-2.5 text-xs text-white bg-[#0E131E] border border-[#1F293D] rounded-xl outline-none focus:border-[#a3e635] placeholder:text-slate-500 transition-colors"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Provide a clear, brief headline describing the problem.
              </p>
            </div>

            {/* Category Grid */}
            <div>
              <label className="block text-xs font-semibold text-white mb-2">
                Maintenance Category <span className="text-rose-400">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {CATEGORIES.map((cat) => {
                  const Icon = categoryIcons[cat.icon] || Wrench;
                  const isSelected = category === cat.name;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => setCategory(cat.name)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col items-center text-center gap-2 ${
                        isSelected
                          ? 'border-[#bbf246] bg-[#bbf246]/15 ring-2 ring-[#bbf246]/40 text-white font-bold shadow-[0_0_16px_rgba(187,242,70,0.25)]'
                          : 'border-[#1F293D] bg-[#0E131E] hover:border-slate-600 hover:bg-[#182132] text-slate-300'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-[#bbf246] text-[#020617]' : 'bg-[#182132] text-slate-400'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs">{cat.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Priority Selector with Helper Guide */}
            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">
                Priority Level <span className="text-rose-400">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {Object.keys(PRIORITIES).map((pKey) => {
                  const pConfig = PRIORITIES[pKey];
                  const isSelected = priority === pKey;
                  return (
                    <div
                      key={pKey}
                      onClick={() => setPriority(pKey)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#bbf246] bg-[#bbf246]/15 ring-2 ring-[#bbf246]/40 shadow-[0_0_16px_rgba(187,242,70,0.25)]'
                          : 'border-[#1F293D] bg-[#0E131E] hover:border-slate-600 hover:bg-[#182132]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>{pConfig.label}</span>
                        <span className="text-[10px] font-mono text-slate-400">SLA: {pConfig.sla}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">{pConfig.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Fault Description */}
            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">
                Detailed Fault Description <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe observations, error codes on displays, when the fault started, and whether it disrupts scheduled classes or lab tests..."
                className="w-full p-3 text-xs text-white bg-[#0E131E] border border-[#1F293D] rounded-xl outline-none focus:border-[#a3e635] placeholder:text-slate-500 transition-colors"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                disabled={!title.trim() || !description.trim()}
                onClick={() => setCurrentStep(2)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#bbf246] hover:bg-[#a3e635] disabled:bg-[#182132] disabled:text-slate-500 text-[#020617] text-xs font-bold rounded-full shadow-[0_0_16px_rgba(187,242,70,0.35)] transition-all"
              >
                <span>Continue to Location</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Location */}
        {currentStep === 2 && (
          <div className="bg-[#131926] rounded-2xl border border-[#1F293D] p-6 shadow-card space-y-6 animate-in fade-in duration-150">
            <div>
              <h3 className="text-sm font-bold text-white">Section B — Campus Location</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Specify the exact university building and room so technicians can locate the fault quickly.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Faculty */}
              <div>
                <label className="block text-xs font-semibold text-white mb-1.5">
                  Faculty / Division <span className="text-rose-400">*</span>
                </label>
                <select
                  value={faculty}
                  onChange={(e) => handleFacultyChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs text-white bg-[#0E131E] border border-[#1F293D] rounded-xl outline-none focus:border-[#a3e635]"
                >
                  {CAMPUS_LOCATIONS.map((f) => (
                    <option key={f.faculty} value={f.faculty} className="bg-[#0E131E] text-white">
                      {f.faculty}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department */}
              <div>
                <label className="block text-xs font-semibold text-white mb-1.5">
                  Department / Unit <span className="text-rose-400">*</span>
                </label>
                <select
                  value={department}
                  onChange={(e) => handleDepartmentChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs text-white bg-[#0E131E] border border-[#1F293D] rounded-xl outline-none focus:border-[#a3e635]"
                >
                  {currentFacultyObj.departments.map((d) => (
                    <option key={d.name} value={d.name} className="bg-[#0E131E] text-white">
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Building */}
              <div>
                <label className="block text-xs font-semibold text-white mb-1.5">
                  Building / Complex <span className="text-rose-400">*</span>
                </label>
                <select
                  value={building}
                  onChange={(e) => handleBuildingChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs text-white bg-[#0E131E] border border-[#1F293D] rounded-xl outline-none focus:border-[#a3e635]"
                >
                  {currentDeptObj.buildings.map((b) => (
                    <option key={b.name} value={b.name} className="bg-[#0E131E] text-white">
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Floor */}
              <div>
                <label className="block text-xs font-semibold text-white mb-1.5">
                  Floor Level <span className="text-rose-400">*</span>
                </label>
                <select
                  value={floor}
                  onChange={(e) => handleFloorChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs text-white bg-[#0E131E] border border-[#1F293D] rounded-xl outline-none focus:border-[#a3e635]"
                >
                  {currentBuildingObj.floors.map((fl) => (
                    <option key={fl.floor} value={fl.floor} className="bg-[#0E131E] text-white">
                      {fl.floor}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Room Number / Identifier */}
            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">
                Room / Laboratory / Office Name <span className="text-rose-400">*</span>
              </label>
              <select
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full px-3 py-2 text-xs text-white bg-[#0E131E] border border-[#1F293D] rounded-xl outline-none focus:border-[#a3e635]"
              >
                {currentFloorObj.rooms.map((rm) => (
                  <option key={rm} value={rm} className="bg-[#0E131E] text-white">
                    {rm}
                  </option>
                ))}
              </select>
            </div>

            {/* Optional Location Notes */}
            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">
                Specific Location Landmark / Notes (Optional)
              </label>
              <input
                type="text"
                value={locationNotes}
                onChange={(e) => setLocationNotes(e.target.value)}
                placeholder="e.g. Near west wall window, bench 3, next to fire exit..."
                className="w-full px-3.5 py-2.5 text-xs text-white bg-[#0E131E] border border-[#1F293D] rounded-xl outline-none focus:border-[#a3e635] placeholder:text-slate-500 transition-colors"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="inline-flex items-center gap-2 px-4 py-2 border border-[#1F293D] hover:bg-white/5 text-slate-300 text-xs font-semibold rounded-full transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#bbf246] hover:bg-[#a3e635] text-[#020617] text-xs font-bold rounded-full shadow-[0_0_16px_rgba(187,242,70,0.35)] transition-all"
              >
                <span>Continue to Evidence</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Attachments */}
        {currentStep === 3 && (
          <div className="bg-[#131926] rounded-2xl border border-[#1F293D] p-6 shadow-card space-y-6 animate-in fade-in duration-150">
            <div>
              <h3 className="text-sm font-bold text-white">Section C — Attachments & Photos</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Upload photos of the physical issue or equipment label to help technicians diagnose faster and bring the right spare parts.
              </p>
            </div>

            {/* Dropzone */}
            <div
              onClick={handleAddMockFile}
              className="border-2 border-dashed border-[#1F293D] hover:border-[#a3e635] rounded-2xl p-8 text-center bg-[#0E131E] hover:bg-[#182132]/60 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#182132] text-[#a3e635] border border-[#1F293D] flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-white">
                Click to attach photos or drag & drop files here
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Supports JPG, PNG, PDF up to 15MB each
              </p>
              <button
                type="button"
                className="mt-3 px-3 py-1.5 text-xs font-semibold bg-[#182132] border border-[#1F293D] rounded-full text-[#a3e635] group-hover:border-[#a3e635]"
              >
                + Browse Local Files
              </button>
            </div>

            {/* Attachment preview list */}
            {attachments.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300">
                  Ready to attach ({attachments.length}):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {attachments.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-[#1F293D] bg-[#0E131E] shadow-xs"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <FileText className="w-4 h-4 text-[#a3e635] flex-shrink-0" />
                        <div className="truncate">
                          <p className="text-xs font-medium text-white truncate">{file.name}</p>
                          <p className="text-[10px] text-slate-400">{file.size}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(file.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 transition-colors"
                        title="Remove attachment"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="inline-flex items-center gap-2 px-4 py-2 border border-[#1F293D] hover:bg-white/5 text-slate-300 text-xs font-semibold rounded-full transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#bbf246] hover:bg-[#a3e635] text-[#020617] text-xs font-bold rounded-full shadow-[0_0_16px_rgba(187,242,70,0.35)] transition-all"
              >
                <span>Continue to Review</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Review Summary & Submit */}
        {currentStep === 4 && (
          <div className="bg-[#131926] rounded-2xl border border-[#1F293D] p-6 shadow-card space-y-6 animate-in fade-in duration-150">
            <div>
              <h3 className="text-sm font-bold text-white">Section D — Review & Submission</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Verify all details before registering this maintenance request in the central system.
              </p>
            </div>

            <div className="divide-y divide-[#1F293D] border border-[#1F293D] rounded-2xl overflow-hidden text-xs bg-[#0E131E]">
              <div className="p-4 bg-[#182132]/40 flex justify-between">
                <span className="text-slate-400">Issue Title:</span>
                <span className="font-semibold text-white text-right max-w-sm">{title}</span>
              </div>
              <div className="p-4 flex justify-between">
                <span className="text-slate-400">Category:</span>
                <span className="font-semibold text-[#a3e635]">{category}</span>
              </div>
              <div className="p-4 flex justify-between">
                <span className="text-slate-400">Priority & SLA:</span>
                <span className="font-semibold text-amber-400">{priority} ({PRIORITIES[priority]?.sla})</span>
              </div>
              <div className="p-4 flex justify-between">
                <span className="text-slate-400">Campus Location:</span>
                <span className="font-medium text-slate-200 text-right max-w-sm">
                  {room}, {floor}, {building}, {faculty}
                </span>
              </div>
              <div className="p-4 flex justify-between">
                <span className="text-slate-400">Requester:</span>
                <span className="font-medium text-slate-300">{currentUser.name} ({currentUser.email})</span>
              </div>
              <div className="p-4 flex justify-between">
                <span className="text-slate-400">Attached Documents:</span>
                <span className="font-medium text-slate-300">{attachments.length} file(s) attached</span>
              </div>
              <div className="p-4 bg-[#182132]/20">
                <span className="text-slate-400 block mb-1">Description:</span>
                <p className="text-slate-300 leading-relaxed">{description}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="inline-flex items-center gap-2 px-4 py-2 border border-[#1F293D] hover:bg-white/5 text-slate-300 text-xs font-semibold rounded-full transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Attachments</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate('my_requests')}
                  className="px-4 py-2.5 border border-[#1F293D] hover:bg-white/5 text-slate-300 text-xs font-semibold rounded-full transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#bbf246] hover:bg-[#a3e635] text-[#020617] text-xs font-bold rounded-full shadow-[0_0_16px_rgba(187,242,70,0.4)] transition-all transform hover:scale-[1.02]"
                >
                  Submit Maintenance Request
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
