import { ItemUpdates } from 'renderer/renderer';
import uuid from 'uuid';
import InventoryItem from './InventoryItem';
import { isValidIsbn } from '../helpers/goodreadsRequest';
import { v100 } from './Schemas';

const nameSpace = 'ce99923f-9be4-427e-b2dd-c4524509d3cf';

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

function createItemFromRow(parsedRow: Array<string>) {
  return new InventoryItem({
    id: parsedRow[0],
    created: parsedRow[1],
    name: parsedRow[2],
    serialNumber: parsedRow[3],
    category: parsedRow[4],
    quantity: parseInt(parsedRow[5], 10),
    description: parsedRow[6],
    location: parsedRow[7],
    dateAquired: parsedRow[8],
    dateRelinquished: parsedRow[9],
    notes: parsedRow[10],
    url: parsedRow[11],
    archived: parsedRow[12] === 'true',
  });
}
class InventoryManager {
  items: Array<InventoryItem> = [];

  categories: Set<string> = new Set();

  locations: Set<string> = new Set();

  seedItemFromParsedRow(parsedRow: Array<string>) {
    const item = createItemFromRow(parsedRow);

    this.items.push(item);
    this.categories.add(item.category);
    this.locations.add(item.location);
  }

  seed(rows: Array<string>) {
    rows.forEach((row) => {
      const parsedRow = parseRow(row);

      this.seedItemFromParsedRow(parsedRow);
    });
  }

  upgradeAndSeed(fileVersion: string, rows: Array<string>) {
    if (fileVersion === v100) {
      // Add `created` column
      rows.forEach((row, idx) => {
        const parsedRow = parseRow(row);
        parsedRow.splice(1, 0, (Date.now() + idx).toString());

        this.seedItemFromParsedRow(parsedRow);
      });
    }
  }

  createNewItem() {
    const now = Date.now().toString();
    // See https://github.com/uuidjs/uuid
    const id = uuid(now, nameSpace);
    const newItem = new InventoryItem({
      id,
      created: now,
      name: '',
      quantity: 1,
      archived: false,
    });

    this.items.push(newItem);

    return newItem;
  }

  updateItem({
    itemUpdates,
    onBookUpdate,
  }: {
    itemUpdates: ItemUpdates;
    onBookUpdate?: ({ id, isbn }: { id: string; isbn: string }) => void;
  }) {
    const toUpdate = this.items.find((itm) => itm.id === itemUpdates.id);

    Object.keys(itemUpdates)
      .filter((k) => k !== 'id')
      .forEach((attr) => {
        toUpdate[attr] = itemUpdates[attr]
      });

    if (Object.keys(itemUpdates).includes('location') && itemUpdates.location) {
      this.locations.add(itemUpdates.location);
    }

    if (Object.keys(itemUpdates).includes('category') && itemUpdates.category) {
      this.categories.add(itemUpdates.category);
    }

    if (
      onBookUpdate &&
      toUpdate?.url.length === 0 &&
      (itemUpdates.category?.toLowerCase().match('book') ||
        ((itemUpdates?.serialNumber || '').length > 0 &&
          toUpdate.category.toLowerCase().match('book'))) &&
      isValidIsbn(itemUpdates.serialNumber || toUpdate.serialNumber)
    ) {
      onBookUpdate({ id: toUpdate.id, isbn: toUpdate.serialNumber });
    }
  }

  deleteItem(itemId: string) {
    this.items = this.items.filter((itm) => itm.id !== itemId);
  }

  stringify() {
    const itemAttributes = Object.getOwnPropertyNames(
      new InventoryItem({
        id: 'default',
        created: Date.now().toString(),
        name: '',
        quantity: 1,
        archived: false,
      })
    );

    const columns = itemAttributes.join(',');

    const rows = this.items.map((item) => {
      const attrs = itemAttributes.map((attribute) => {
        if (typeof item[attribute] === 'string') {
          if (item[attribute].length === 0) {
            return '';
          }

          return `"${item[attribute]}"`.replace(/\n/g, '\\n');
        }

        return item[attribute];
      });

      return attrs.join(',');
    });

    return [columns, ...rows].join('\n');
  }

  reset() {
    this.items = [];
  }
}

export default InventoryManager;
