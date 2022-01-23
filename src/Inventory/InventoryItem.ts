class InventoryItem {
  id: string;

  name: string;

  serialNumber: string;

  category: string;

  description: string;

  location: string;

  dateAcquired: string; // TODO: Maybe date object?

  dateRelinquished: string; // TODO: Maybe date object?

  notes: string;

  constructor({
    id,
    name,
    serialNumber,
    category,
    description,
    location,
    dateAquired,
    dateRelinquished,
    notes,
  }: {
    id: string;
    name: string;
    serialNumber?: string;
    category?: string;
    description?: string;
    location?: string;
    dateAquired?: string;
    dateRelinquished?: string;
    notes?: string;
  }) {
    // TODO: Add list of updates?
    //    If tracking changes also track:
    //        Date item created
    //        Date item last updated
    //        Or track time of each change
    // TODO: Add quantity
    // TODO: Add url field

    // NOTE! The order of these attributes matter -> Object.getOwnPropertyNames(new InventoryItem())
    this.id = id;
    this.name = name;
    this.serialNumber = serialNumber || '';
    this.category = category || '';
    this.description = description || '';
    this.location = location || '';
    this.dateAcquired = dateAquired || '';
    this.dateRelinquished = dateRelinquished || '';
    this.notes = notes || '';
  }
}

export default InventoryItem;
