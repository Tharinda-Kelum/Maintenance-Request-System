import React, { useState } from 'react';
import { Building2, Search, Plus, MapPin } from 'lucide-react';
import { useLocations } from '../../context/LocationContext';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

export const CampusLocationsPage = () => {
  const { locations, addLocation } = useLocations();
  const { currentUser, activeRoleId } = useAuth();
  const { showToast } = useToast();
  const [query, setQuery] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [draft, setDraft] = useState({ faculty: '', department: '', building: '', floor: '', room: '' });
  const matching = locations.filter((faculty) => JSON.stringify(faculty).toLowerCase().includes(query.trim().toLowerCase()));
  const submit = (event) => { event.preventDefault(); if (Object.values(draft).some((value) => !value.trim())) return; addLocation(Object.fromEntries(Object.entries(draft).map(([key, value]) => [key, value.trim()]))); setShowAdd(false); setDraft({ faculty: '', department: '', building: '', floor: '', room: '' }); showToast('Campus location added. It is now available when creating a request.', 'success'); };
  return <div className="portal-page"><div className="page-heading"><div><p className="eyebrow">FIND YOUR WAY</p><h1>Campus locations</h1><p>Find faculty buildings, floors, and room names for your maintenance request.</p></div>{activeRoleId === 'super_admin' && <button className="ui-button primary" onClick={() => setShowAdd(true)}><Plus size={18} /> Add location</button>}</div><label className="search-field"><Search size={18} /><span className="sr-only">Search campus locations</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search faculty, building, or room" /></label>{matching.length ? matching.map((faculty) => <details key={`${faculty.faculty}-${Boolean(query)}`} className="ui-panel location-group" open={Boolean(query) || faculty.faculty === currentUser.faculty}><summary><Building2 size={21} /><span>{faculty.faculty}<small>{faculty.departments.length} departments / units</small></span></summary><div className="location-departments">{faculty.departments.map((department) => <section key={department.name}><h2>{department.name}</h2>{department.buildings.map((building) => <div className="location-building" key={building.name}><h3><MapPin size={17} />{building.name}</h3>{building.floors.map((floor) => <div className="location-floor" key={floor.floor}><strong>{floor.floor}</strong><div>{floor.rooms.map((room) => <span key={room}>{room}</span>)}</div></div>)}</div>)}</section>)}</div></details>) : <section className="ui-panel friendly-empty"><Search size={30} /><h2>No matching locations</h2><p>Try a building, faculty, or room name.</p><button className="ui-button secondary" onClick={() => setQuery('')}>Clear search</button></section>}
    {showAdd && <Modal isOpen onClose={() => setShowAdd(false)} title="Add campus location" footer={<><button className="ui-button secondary" onClick={() => setShowAdd(false)}>Cancel</button><button type="submit" form="add-location" className="ui-button primary">Add location</button></>}><form id="add-location" onSubmit={submit} className="form-fields">{[['faculty', 'Faculty / division'], ['department', 'Department / unit'], ['building', 'Building'], ['floor', 'Floor'], ['room', 'Room']].map(([key, label]) => <label key={key}>{label} *<input required value={draft[key]} onChange={(event) => setDraft({ ...draft, [key]: event.target.value })} /></label>)}</form></Modal>}
  </div>;
};
