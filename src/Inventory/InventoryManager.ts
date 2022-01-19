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
        category: parsedRow[1],
        dateAquired: parsedRow[2],
        dateRelinquished: parsedRow[3],
        description: parsedRow[4],
        location: parsedRow[5],
        name: parsedRow[6],
        notes: parsedRow[7],
      });

      this.items.push(item);
    });
  }
}

export default InventoryManager;
