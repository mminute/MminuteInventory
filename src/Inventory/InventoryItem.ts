class InventoryItem {
  id: string;

  name: string;

  serialNumber: string;

  category: string;

  quantity: number;

  description: string;

  location: string;

  dateAcquired: string;

  dateRelinquished: string;

  notes: string;

  url: string;

  archived: boolean;

  constructor({
    id,
    name,
    serialNumber,
    category,
    quantity,
    description,
    location,
    dateAquired,
    dateRelinquished,
    notes,
    url,
    archived,
  }: {
    id: string;
    name: string;
    serialNumber?: string;
    category?: string;
    quantity: number;
    description?: string;
    location?: string;
    dateAquired?: string;
    dateRelinquished?: string;
    notes?: string;
    url?: string;
    archived: boolean;
  }) {
    // TODO: Add list of updates?
    //    If tracking changes also track:
    //        Date item created
    //        Date item last updated
    //        Or track time of each change

    // NOTE! The order of these attributes matter -> Object.getOwnPropertyNames(new InventoryItem())
    this.id = id;
    this.name = name;
    this.serialNumber = serialNumber || '';
    this.category = category || '';
    this.quantity = quantity;
    this.description = description || '';
    this.location = location || '';
    this.dateAcquired = dateAquired || '';
    this.dateRelinquished = dateRelinquished || '';
    this.notes = notes || '';
    this.url = url || '';
    this.archived = archived;
  }
}

export default InventoryItem;
