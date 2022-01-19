class InventoryItem {
  id: string;

  category: string;

  dateAcquired: string; // TODO: Maybe date object?

  dateRelinquished: string; // TODO: Maybe date object?

  description: string;

  location: string;

  name: string;

  notes: string;

  constructor({
    id,
    category,
    dateAquired,
    dateRelinquished,
    description,
    location,
    name,
    notes,
  }: {
    id: string;
    category?: string;
    dateAquired?: string;
    dateRelinquished?: string;
    description?: string;
    location?: string;
    name: string;
    notes?: string;
  }) {
    // TODO: Add dateAdded field?
    // TODO: Add lastUpdated field?
    // TODO: Add list of updates?
    // TODO: Add quantity
    // TODO: Add url field
    this.id = id;
    this.category = category || '';
    this.dateAcquired = dateAquired || '';
    this.dateRelinquished = dateRelinquished || '';
    this.description = description || '';
    this.location = location || '';
    this.name = name;
    this.notes = notes || '';
  }
}

export default InventoryItem;
