import React, { useState } from 'react';
import { Building2, ChevronRight, ChevronDown, MapPin, Plus, Layers, Home } from 'lucide-react';
import { CAMPUS_LOCATIONS } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';

export const CampusLocationsPage = () => {
  const [locations, setLocations] = useState(CAMPUS_LOCATIONS);
  const [expandedFaculty, setExpandedFaculty] = useState(CAMPUS_LOCATIONS[0].faculty);
  const { showToast } = useToast();

  const handleAddLocation = () => {
    showToast('Location configuration drawer opened', 'info');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-card border border-brand-border shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-brand-text">
            Campus Facilities & Locations Hierarchy
          </h1>
          <p className="text-xs text-brand-text-secondary mt-0.5">
            Hierarchical mapping of university faculties, complexes, laboratory blocks, lecture theatres, and office rooms.
          </p>
        </div>

        <button
          onClick={handleAddLocation}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-brand-blue hover:bg-brand-blue-hover text-white shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Campus Facility</span>
        </button>
      </div>

      {/* Hierarchy Explorer */}
      <div className="space-y-4">
        {locations.map((fac, fIdx) => {
          const isExpanded = expandedFaculty === fac.faculty;
          return (
            <div
              key={fIdx}
              className="bg-white rounded-card border border-brand-border shadow-xs overflow-hidden"
            >
              {/* Faculty Level Header */}
              <div
                onClick={() => setExpandedFaculty(isExpanded ? null : fac.faculty)}
                className="p-4 bg-slate-50/70 border-b border-brand-border flex items-center justify-between cursor-pointer hover:bg-slate-100/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-brand-blue flex items-center justify-center font-bold text-xs">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-brand-text">{fac.faculty}</h3>
                    <p className="text-[11px] text-slate-500">
                      {fac.departments.length} Academic Department{fac.departments.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                )}
              </div>

              {/* Expanded Department & Building tree */}
              {isExpanded && (
                <div className="p-5 space-y-5 divide-y divide-slate-100 text-xs">
                  {fac.departments.map((dept, dIdx) => (
                    <div key={dIdx} className="pt-4 first:pt-0 space-y-3">
                      <div className="flex items-center gap-2 font-bold text-slate-800">
                        <span className="w-2 h-2 rounded-full bg-brand-blue" />
                        <span>{dept.name}</span>
                      </div>

                      {/* Buildings */}
                      <div className="pl-4 space-y-3">
                        {dept.buildings.map((bld, bIdx) => (
                          <div
                            key={bIdx}
                            className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-brand-navy flex items-center gap-2">
                                <Home className="w-3.5 h-3.5 text-slate-500" />
                                {bld.name}
                              </span>
                              <span className="text-[11px] text-slate-400">
                                {bld.floors.length} Floors
                              </span>
                            </div>

                            {/* Floors & Rooms */}
                            <div className="space-y-2 pt-2 border-t border-slate-200">
                              {bld.floors.map((fl, flIdx) => (
                                <div key={flIdx} className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                                  <span className="font-mono text-slate-500 font-semibold w-28 flex-shrink-0 text-[11px]">
                                    {fl.floor}:
                                  </span>
                                  <div className="flex flex-wrap gap-1.5 flex-1">
                                    {fl.rooms.map((rm, rmIdx) => (
                                      <span
                                        key={rmIdx}
                                        className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 text-[11px] font-medium shadow-2xs hover:border-brand-blue transition-colors"
                                      >
                                        {rm}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
