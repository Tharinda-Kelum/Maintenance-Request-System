import React, { createContext, useContext, useState } from 'react';
import { CAMPUS_LOCATIONS } from '../data/mockData';

const LocationContext = createContext(null);
export const LocationProvider = ({ children }) => {
  const [locations, setLocations] = useState(CAMPUS_LOCATIONS);
  const addLocation = (details) => setLocations((previous) => {
    const next = structuredClone(previous);
    let faculty = next.find((item) => item.faculty === details.faculty);
    if (!faculty) { faculty = { faculty: details.faculty, departments: [] }; next.push(faculty); }
    let department = faculty.departments.find((item) => item.name === details.department);
    if (!department) { department = { name: details.department, buildings: [] }; faculty.departments.push(department); }
    let building = department.buildings.find((item) => item.name === details.building);
    if (!building) { building = { name: details.building, floors: [] }; department.buildings.push(building); }
    let floor = building.floors.find((item) => item.floor === details.floor);
    if (!floor) { floor = { floor: details.floor, rooms: [] }; building.floors.push(floor); }
    if (!floor.rooms.includes(details.room)) floor.rooms.push(details.room);
    return next;
  });
  return <LocationContext.Provider value={{ locations, addLocation }}>{children}</LocationContext.Provider>;
};
export const useLocations = () => useContext(LocationContext);
