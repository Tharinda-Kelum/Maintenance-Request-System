import React, { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, UploadCloud, X, FileText, MapPin, ClipboardCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTickets } from '../../context/TicketContext';
import { CATEGORIES, PRIORITIES } from '../../data/mockData';
import { useLocations } from '../../context/LocationContext';
import { readAttachments } from '../../utils/attachments';

const steps = ['Describe the problem', 'Choose the location', 'Review & send'];
const priorityHelp = { Low: 'A small issue that can wait.', Medium: 'Affects everyday use of a room or equipment.', High: 'Disrupts classes, labs, or important work.', Urgent: 'An immediate safety risk, major leak, or power outage.' };

export const CreateRequestPage = ({ onNavigate, onSelectTicket }) => {
  const { currentUser } = useAuth();
  const { createTicket } = useTickets();
  const { locations: CAMPUS_LOCATIONS } = useLocations();
  const [step, setStep] = useState(0);
  const [details, setDetails] = useState({ title: '', description: '', category: '', priority: 'Medium', locationNotes: '' });
  const firstFaculty = CAMPUS_LOCATIONS.find((item) => item.faculty === currentUser.faculty) || CAMPUS_LOCATIONS[0];
  const initialDepartment = firstFaculty.departments.find((item) => item.name === currentUser.department) || firstFaculty.departments[0];
  const [location, setLocation] = useState({ faculty: firstFaculty.faculty, department: initialDepartment.name, building: initialDepartment.buildings[0].name, floor: initialDepartment.buildings[0].floors[0].floor, room: initialDepartment.buildings[0].floors[0].rooms[0] });
  const [attachments, setAttachments] = useState([]);
  const [error, setError] = useState('');
  const [readingFiles, setReadingFiles] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef(null);
  const submittingRef = useRef(false);
  const currentFaculty = CAMPUS_LOCATIONS.find((item) => item.faculty === location.faculty);
  const currentDepartment = currentFaculty.departments.find((item) => item.name === location.department);
  const currentBuilding = currentDepartment.buildings.find((item) => item.name === location.building);
  const currentFloor = currentBuilding.floors.find((item) => item.floor === location.floor);
  const updateDetails = (key, value) => setDetails((previous) => ({ ...previous, [key]: value }));
  const changeLocation = (key, value) => {
    const next = { ...location, [key]: value };
    const faculty = CAMPUS_LOCATIONS.find((item) => item.faculty === next.faculty);
    if (key === 'faculty') next.department = faculty.departments[0].name;
    const department = faculty.departments.find((item) => item.name === next.department);
    if (['faculty', 'department'].includes(key)) next.building = department.buildings[0].name;
    const building = department.buildings.find((item) => item.name === next.building);
    if (['faculty', 'department', 'building'].includes(key)) next.floor = building.floors[0].floor;
    const floor = building.floors.find((item) => item.floor === next.floor);
    if (key !== 'room') next.room = floor.rooms[0];
    setLocation(next);
  };
  const addFiles = async (files) => {
    if (readingFiles) return;
    const selected = Array.from(files);
    if (!selected.length) return;
    setError('');
    setReadingFiles(true);
    try {
      const uploaded = await readAttachments(selected, attachments.length);
      setAttachments((previous) => [...previous, ...uploaded]);
    } catch (failure) { setError(failure.message); } finally { setReadingFiles(false); if (inputRef.current) inputRef.current.value = ''; }
  };
  const moveTo = (nextStep) => {
    setError('');
    setStep(nextStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const submit = async (event) => {
    event.preventDefault();
    if (!details.title.trim() || !details.description.trim() || !details.category) { setError('Add a title, category, and description to continue.'); setStep(0); return; }
    if (step < 2) { moveTo(step + 1); return; }
    if (readingFiles || submittingRef.current) return;
    submittingRef.current = true;
    setIsSubmitting(true); setError('');
    try {
      const ticket = await createTicket({ ...details, title: details.title.trim(), description: details.description.trim(), ...location, attachments });
      setSubmitted(ticket);
    } catch (failure) { setError(failure.message); }
    finally { submittingRef.current = false; setIsSubmitting(false); }
  };

  if (submitted) return <div className="portal-page form-page"><section className="ui-panel success-panel"><CheckCircle2 size={52} /><p className="eyebrow">REQUEST SENT</p><h1>We have received your request</h1><p>Your HOD will review it first, followed by the Dean and maintenance team. You can follow updates in My requests.</p><div className="confirmation-reference"><span>Your request number</span><strong>{submitted.id}</strong><span>{submitted.title}</span></div><div className="button-group"><button className="ui-button primary" onClick={() => onSelectTicket(submitted.id)}>Track my request <ArrowRight size={17} /></button><button className="ui-button secondary" onClick={() => onNavigate('my_requests')}>All my requests</button></div></section></div>;

  return <div className="portal-page form-page">
    <button className="text-action" onClick={() => onNavigate('my_requests')}><ArrowLeft size={17} /> Back to my requests</button>
    <div className="page-heading"><div><p className="eyebrow">LET'S GET IT FIXED</p><h1>New maintenance request</h1><p>A few details will help us send the right person to the right place.</p></div></div>
    <ol className="form-steps" aria-label="Request progress">{steps.map((label, index) => <li key={label} className={index === step ? 'current' : index < step ? 'done' : ''} aria-current={index === step ? 'step' : undefined}><button type="button" disabled={index > step} onClick={() => moveTo(index)}><span>{index < step ? <Check size={17} /> : index + 1}</span><span>{label}</span></button></li>)}</ol>
    <form onSubmit={submit} className="ui-panel request-form">
      <div className="form-section-heading"><span className="eyebrow">STEP {step + 1} OF 3</span><h2>{steps[step]}</h2><p>{['Tell us what is wrong. Fields marked * are required.', 'Check the selected location so the technician can find the problem.', 'Check your details. You can go back to change anything before sending.'][step]}</p></div>
      {error && <div role="alert" className="form-error">{error}</div>}
      {step === 0 && <div className="form-fields">
        <label htmlFor="issue-title">What needs fixing? *<input id="issue-title" required maxLength={160} value={details.title} onChange={(event) => updateDetails('title', event.target.value)} placeholder="e.g. The air conditioner in Room 204 is not cooling" autoFocus /></label>
        <label htmlFor="issue-category">Type of problem *<select id="issue-category" required value={details.category} onChange={(event) => updateDetails('category', event.target.value)}><option value="">Choose a category</option>{CATEGORIES.map((category) => <option key={category.id}>{category.name}</option>)}</select></label>
        <label htmlFor="issue-description">Describe the problem *<textarea id="issue-description" required rows={4} maxLength={5000} value={details.description} onChange={(event) => updateDetails('description', event.target.value)} placeholder="What happened? When did it start? Tell us anything that may help." /></label>
        <fieldset><legend>How urgent is it?</legend><div className="priority-options">{Object.keys(PRIORITIES).map((priority) => <label key={priority} className={details.priority === priority ? 'selected' : ''}><input type="radio" name="priority" value={priority} checked={details.priority === priority} onChange={() => updateDetails('priority', priority)} /><span><strong>{priority}</strong><small>{priorityHelp[priority]}</small></span></label>)}</div></fieldset>
        {details.priority === 'Urgent' && <p className="form-hint">For an immediate safety risk, also contact university maintenance on extension 4211.</p>}
        <div><h3>Photos or documents <span className="muted">(optional)</span></h3><p className="form-hint">A photo can help the technician understand the problem.</p><input className="sr-only" ref={inputRef} type="file" multiple accept="image/jpeg,image/png,application/pdf" onChange={(event) => addFiles(event.target.files)} aria-label="Attach photos or documents" /><button type="button" className="upload-zone" disabled={readingFiles} onClick={() => inputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); addFiles(event.dataTransfer.files); }}><UploadCloud size={27} /><strong>{readingFiles ? 'Reading your files…' : 'Choose files or drop them here'}</strong><span>JPG, PNG, or PDF · up to 15 MB each · maximum 5 files</span></button><ul className="attachment-list">{attachments.map((file) => <li key={file.id}><FileText size={17} /><span>{file.name}<small>{file.size}</small></span><button type="button" className="icon-button" aria-label={`Remove ${file.name}`} onClick={() => setAttachments(attachments.filter((item) => item.id !== file.id))}><X size={17} /></button></li>)}</ul></div>
      </div>}
      {step === 1 && <div className="form-fields"><div className="location-fields">{[
        ['faculty', 'Faculty / division', CAMPUS_LOCATIONS.map((item) => item.faculty)],
        ['department', 'Department', currentFaculty.departments.map((item) => item.name)],
        ['building', 'Building', currentDepartment.buildings.map((item) => item.name)],
        ['floor', 'Floor', currentBuilding.floors.map((item) => item.floor)],
        ['room', 'Room / office', currentFloor.rooms],
      ].map(([key, label, options]) => <label key={key} htmlFor={`location-${key}`}>{label} *<select id={`location-${key}`} required value={location[key]} onChange={(event) => changeLocation(key, event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select></label>)}</div><label htmlFor="location-notes">Anything else to help us find it? <span className="muted">(optional)</span><input id="location-notes" value={details.locationNotes} onChange={(event) => updateDetails('locationNotes', event.target.value)} placeholder="e.g. Next to the window, on the left side of the room" /></label><p className="location-preview"><MapPin size={19} /> {location.room}, {location.floor}, {location.building}</p></div>}
      {step === 2 && <div className="review-sections"><section><div className="panel-heading"><h3><ClipboardCheck size={18} /> Problem details</h3><button type="button" className="text-action" onClick={() => moveTo(0)}>Edit</button></div><h3>{details.title}</h3><p>{details.category} · {details.priority} priority</p><p className="whitespace-pre-wrap">{details.description}</p><p>{attachments.length ? `${attachments.length} file(s) attached` : 'No attachments'}</p></section><section><div className="panel-heading"><h3><MapPin size={18} /> Location</h3><button type="button" className="text-action" onClick={() => moveTo(1)}>Edit</button></div><p>{location.room}, {location.floor}, {location.building}</p><p>{location.department}, {location.faculty}</p>{details.locationNotes && <p>{details.locationNotes}</p>}</section><p className="form-hint">Submitted by {currentUser.name} · {currentUser.email}</p></div>}
      <div className="form-actions"><button type="button" className="ui-button secondary" onClick={() => step ? moveTo(step - 1) : onNavigate('my_requests')}><ArrowLeft size={16} /> {step ? 'Back' : 'Cancel'}</button><button type="submit" className="ui-button primary" disabled={readingFiles || isSubmitting}>{isSubmitting ? 'Sending…' : step === 2 ? 'Send request' : 'Continue'} <ArrowRight size={17} /></button></div>
    </form>
  </div>;
};
