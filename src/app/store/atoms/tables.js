import { atom } from "jotai";

// Atom to store the initial floor arrangements
export const floorsAtom = atom();

// Atom to store the currently selected floor
export const selectedFloorAtom = atom(null);

// Atom to store the currently selected area
export const selectedAreaAtom = atom(null);

// Selector to get areas based on the selected floor
export const areasAtom = atom((get) => {
  const selectedFloor = get(selectedFloorAtom);
  if (!selectedFloor) return [];
  return get(floorsAtom).find((floor) => floor.id === selectedFloor.id)?.areas || [];
});

// Selector to get tables based on the selected area
export const areaTablesAtom = atom((get) => {
  const selectedArea = get(selectedAreaAtom);
  const selectedFloor = get(selectedFloorAtom);

  if (!selectedArea || !selectedFloor) return [];

  const floor = get(floorsAtom).find((e) => e.id === selectedFloor.id);
  const area = floor?.areas?.find((item) => item.id === selectedArea.id);

  return area && area.tables ? area.tables : [];
});

// Atom to add a new table to the selected area
export const addTableAtom = atom(null, (get, set, newTable) => {
  const selectedFloor = get(selectedFloorAtom);
  const selectedArea = get(selectedAreaAtom);

  if (!selectedFloor || !selectedArea) return;

  const updatedFloors = get(floorsAtom).map((floor) => {
    if (floor.id === selectedFloor.id) {
      const updatedAreas = floor.areas.map((area) => {
        if (area.id === selectedArea.id) return { ...area, tables: [...area.tables, newTable] };
        return area;
      });
      return { ...floor, areas: updatedAreas };
    }
    return floor;
  });

  set(floorsAtom, updatedFloors);
});

// Atom to update an existing table in the selected area
export const updateTableAtom = atom(null, (get, set, { id, updatedTable }) => {
  const selectedFloor = get(selectedFloorAtom);
  const selectedArea = get(selectedAreaAtom);

  if (!selectedFloor || !selectedArea) return;

  const updatedFloors = get(floorsAtom).map((floor) => {
    if (floor.id === selectedFloor.id) {
      const updatedAreas = floor.areas.map((area) => {
        if (area.id === selectedArea.id) {
          const updatedTables = area.tables.map((table) => {
            if (table.id === Number(id)) return { ...table, ...updatedTable, geometry: { ...updatedTable.geometry } };
            return { ...table };
          });
          return { ...area, tables: updatedTables };
        }
        return area;
      });
      return { ...floor, areas: updatedAreas };
    }
    return floor;
  });

  set(floorsAtom, updatedFloors);
});

// Atom to add a new area to the selected floor
export const addAreaAtom = atom(null, (get, set, newArea) => {
  const selectedFloor = get(selectedFloorAtom);

  if (!selectedFloor) return;

  const updatedFloors = get(floorsAtom).map((floor) => {
    if (floor.id === selectedFloor.id) {
      const updatedAreas = [...floor.areas, newArea];
      return { ...floor, areas: updatedAreas };
    }
    return floor;
  });

  set(floorsAtom, updatedFloors);
});

export const modifiedTablesAtom = atom((get) => {
  const floors = get(floorsAtom);
  if (floors && floors.length > 0) {
    const allTables = floors.flatMap((floor) => floor.areas?.flatMap((area) => area.tables));
    return allTables.filter((table) => table.modified);
  }
  return [];
});

// Atom to update modified tables and remove the "modified" attribute
export const resetModifiedTablesAtom = atom(null, (get, set) => {
  const modifiedTables = get(modifiedTablesAtom);

  if (modifiedTables.length > 0) {
    const updatedFloors = get(floorsAtom).map((floor) => {
      const updatedAreas = floor.areas.map((area) => {
        const updatedTables = area.tables.map((table) => {
          if (modifiedTables.includes(table)) {
            return { ...table, modified: undefined };
          }
          return table;
        });
        return { ...area, tables: updatedTables };
      });
      return { ...floor, areas: updatedAreas };
    });

    set(floorsAtom, updatedFloors);
  }
});

// Atom to set the status of a table in a specified table atom
// Atom to update an existing table in the selected area
export const updateTableStatusAtom = atom(null, (get, set, { id, status }) => {
  const selectedFloor = get(selectedFloorAtom);
  const selectedArea = get(selectedAreaAtom);

  if (!selectedFloor || !selectedArea) return;

  const updatedFloors = get(floorsAtom).map((floor) => {
    if (floor.id === selectedFloor.id) {
      const updatedAreas = floor.areas.map((area) => {
        if (area.id === selectedArea.id) {
          const updatedTables = area.tables.map((table) => {
            if (table.id === Number(id)) return { ...table, status: status };
            return table;
          });
          return { ...area, tables: updatedTables };
        }
        return area;
      });
      return { ...floor, areas: updatedAreas };
    }
    return floor;
  });

  set(floorsAtom, updatedFloors);
});

// Atom to get a table by its ID
export const tableByIdAtom = atom((get, set, id) => {
  const floors = get(floorsAtom);

  if (!floors || !floors.length) return null;

  const table = floors.flatMap((floor) => floor.areas?.flatMap((area) => area.tables?.find((t) => t.id === id)));

  return table ? table[0] : null;
});

// Atom to store the currently selected table
export const selectedTableAtom = atom(null);

export const floorAndAreaByTableIdAtom = atom((get, set, tableId) => {
  const floors = get(floorsAtom);
  const selectedTable = get(selectedTableAtom);

  if (selectedTable) {
    if (!floors || !floors.length) return null;

    const matchingFloor = floors.find((floor) => {
      return floor.areas?.some((area) => {
        return area.tables?.some((table) => table.id === selectedTable.id);
      });
    });

    if (!matchingFloor) return null;

    const matchingArea = matchingFloor.areas?.find((area) => {
      return area.tables?.some((table) => table.id === selectedTable.id);
    });

    return matchingArea ? { floor: matchingFloor, area: matchingArea } : null;
  }

  return null;
});
