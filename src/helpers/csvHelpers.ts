import InventoryItem from '../Inventory/InventoryItem';

const item = new InventoryItem({ id: '', name: '' });

export function generateInventoryColumns() {
  return Object.getOwnPropertyNames(item).join(',');
}

export function areColumnsValid(columns: string) {
  return Object.getOwnPropertyNames(item).join(',') === columns;
}
