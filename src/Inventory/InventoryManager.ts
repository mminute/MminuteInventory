import { ItemUpdates } from 'renderer/renderer';
import InventoryItem from './InventoryItem';

function parseRow(row: string) {
  // Copied from:
  // https://www.geeksforgeeks.org/how-to-convert-csv-to-json-file-having-comma-separated-values-in-node-js/
  let processedString = '';
  let isInQuote = false;

  row.split('').forEach((char) => {
    let processedCharacter = char;

    if (processedCharacter === '"' && !isInQuote) {
      isInQuote = true;
    } else if (processedCharacter === '"' && isInQuote) {
      isInQuote = false;
    }

    if (processedCharacter === ',' && !isInQuote) {
      processedCharacter = '|';
    }

    if (char !== '"') {
      processedString += processedCharacter;
    }
  });

  return processedString.split('|');
}

// TODO: Disallow input of '"' characters in the UI
class InventoryManager {
  items: Array<InventoryItem> = [];

  seed(rows: Array<string>) {
    rows.forEach((row) => {
      const parsedRow = parseRow(row);

      const item = new InventoryItem({
        id: parsedRow[0],
        name: parsedRow[1],
        category: parsedRow[2],
        description: parsedRow[3],
        location: parsedRow[4],
        dateAquired: parsedRow[5],
        dateRelinquished: parsedRow[6],
        notes: parsedRow[7],
      });

      this.items.push(item);
    });
  }

  updateItem(itemUpdates: ItemUpdates) {
    const toUpdate = this.items.find((itm) => itm.id === itemUpdates.id);

    Object.keys(itemUpdates)
      .filter((k) => k !== 'id')
      .forEach((attr) => {
        toUpdate[attr] = itemUpdates[attr]
      });
  }
}

export default InventoryManager;
