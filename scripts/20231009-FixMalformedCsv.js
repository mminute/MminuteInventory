const fs = require('fs');

const targetFile =
  '/Users/masonjennings/code/mminuteInventory/scripts/DATA/20231009BadData.csv';
const destinationFile =
  '/Users/masonjennings/code/mminuteInventory/scripts/DATA/20231009FixedData.csv';

// Newline characters were not handled correctly within the app
// So single entries were split into multiple rows
function fixCsv() {
  const fileData = fs.readFileSync(targetFile, 'utf8').split('\n');

  const items = [];
  let currentItem = null;

  while (fileData.length > 0) {
    const currentRow = fileData.shift();

    if (currentRow) {
      if (!currentItem) {
        currentItem = [];
      }

      currentItem.push(currentRow);
    } else {
      if (currentItem) {
        items.push(currentItem);
      }

      currentItem = null;
    }
  }

  const fixedItems = items.map((itemRows) => {
    const toUpdate = itemRows.shift();
    const descriptionUpdates = [];
    let urlUpdate = '';

    itemRows.forEach((row) => {
      row.split(',').forEach((attr) => {
        if (attr && !(attr.match(/NaN/) || attr.match(/false/))) {
          if (attr.match(/^http/)) {
            urlUpdate = attr;
          } else {
            descriptionUpdates.push(attr);
          }
        }
      });
    });

    const cleanDescriptionUpdates = descriptionUpdates.reduce((acc, curr) => {
      const clean = curr.replace(/"/g, '');
      return acc.length === 0 ? clean : `${acc}; ${clean}`;
    }, '');

    // DANGER! If there are commas within strings this will break things
    // Verified that all entries have the same number of "fields" when split by commas
    const entryFields = toUpdate.split(',');
    const description = entryFields[6].replace(/"/g, '');
    const updatedDescription = cleanDescriptionUpdates
      ? `"${description}; ${cleanDescriptionUpdates}"`
      : `"${description}"`;

    entryFields[6] = updatedDescription;

    if (!entryFields[11] && urlUpdate) {
      entryFields[11] = urlUpdate;
    }

    return entryFields.join(',');
  });

  fs.writeFileSync(destinationFile, fixedItems.join('\n'));
}

fixCsv();
