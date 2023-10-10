import { useState } from 'react';
import { Box, Icon, Table, Text } from 'gestalt';
import InventoryItem from '../../Inventory/InventoryItem';
import InventorySearch from './InventorySearch';

const ASC = 'asc';
const DESC = 'desc';

const inventoryItemAttributes = Object.getOwnPropertyNames(
  new InventoryItem({
    id: '',
    created: Date.now().toString(),
    name: '',
    archived: false,
    quantity: 1,
  })
).filter(
  (attr) =>
    // Do not show these item attributes
    ![
      'id',
      'archived',
      'dateAcquired',
      'dateRelinquished',
      'serialNumber',
      'url',
    ].includes(attr)
);

function camelCaseToSentence(camelCasedStr: string) {
  return (
    camelCasedStr
      // insert a space before all caps
      .replace(/([A-Z])/g, ' $1')
      // uppercase the first character
      .replace(/^./, (str) => {
        return str.toUpperCase();
      })
  );
}

function HeaderCell({
  attr,
  onSortChange,
  sortCol,
  sortOrder,
}: {
  attr: string;
  onSortChange: (col: string) => void;
  sortCol: string;
  sortOrder: 'asc' | 'desc';
}) {
  return (
    <Table.SortableHeaderCell
      onSortChange={() => onSortChange(attr)}
      sortOrder={sortOrder}
      status={sortCol === attr ? 'active' : 'inactive'}
    >
      {attr === 'created' ? (
        <Icon icon="calendar" accessibilityLabel="created" color="darkGray" />
      ) : (
        <Text weight="bold">{camelCaseToSentence(attr)}</Text>
      )}
    </Table.SortableHeaderCell>
  );
}

function Row({
  item,
  handleTap,
}: {
  item: InventoryItem;
  handleTap: (item: InventoryItem | null) => void;
}) {
  return (
    <tr onClick={() => handleTap(item)} style={{ cursor: 'zoom-in' }}>
      {inventoryItemAttributes.map((attr) => {
        const val =
          attr === 'description'
            ? (item[attr] || '').replaceAll('\\n', '\n')
            : item[attr];
        return (
          <Table.Cell key={attr}>
            {attr === 'created' ? null : (
              <Box minWidth={attr === 'name' ? '200px' : ''}>
                <Text color={item.archived ? 'gray' : 'darkGray'} lineClamp={1}>
                  {val}
                </Text>
              </Box>
            )}
          </Table.Cell>
        );
      })}
    </tr>
  );
}

function sortAndFilter({
  categories: defaultCategories,
  inventory,
  locations: defaultLocations,
  searchCategories,
  searchLocations,
  searchTerm,
  showArchived,
  sortCol,
  sortOrder,
}: {
  categories: Array<string>;
  inventory: Array<InventoryItem>;
  locations: Array<string>;
  searchCategories: Array<string>;
  searchLocations: Array<string>;
  searchTerm: string;
  showArchived: boolean;
  sortCol: string;
  sortOrder: 'asc' | 'desc';
}): Array<InventoryItem> {
  const sortOrderValue = sortOrder === ASC ? -1 : 1;

  const categories = searchCategories.length
    ? searchCategories
    : ['', ...defaultCategories]; // '' covers case where no category is chosen

  const locations = searchLocations.length
    ? searchLocations
    : ['', ...defaultLocations]; // '' covers case where no location is chosen

  const term = searchTerm.toLowerCase();

  const items = inventory.filter((itm) => {
    return (
      (showArchived ? true : !itm.archived) &&
      categories.includes(itm.category) &&
      locations.includes(itm.location) &&
      (itm.name.toLocaleLowerCase().match(term) ||
        itm.description.toLocaleLowerCase().match(term) ||
        itm.notes.toLocaleLowerCase().match(term) ||
        itm.category.toLocaleLowerCase().match(term) ||
        itm.location.toLocaleLowerCase().match(term))
    );
  });

  items.sort((firstItem, secondItem) => {
    let firstItemVal = firstItem[sortCol];
    let secondItemVal = secondItem[sortCol];

    if (typeof firstItemVal === 'string') {
      firstItemVal = firstItemVal.toLowerCase();
      secondItemVal = secondItemVal.toLowerCase();
    }

    if (firstItemVal < secondItemVal) {
      return -sortOrderValue;
    }

    if (firstItemVal > secondItemVal) {
      return sortOrderValue;
    }

    return 0;
  });

  return items;
}

interface Props {
  categories: Array<string>;
  inventory: Array<InventoryItem>;
  locations: Array<string>;
  onSelectItem: (item: InventoryItem | null) => void;
  showArchived: boolean;
  sortColSetting: string;
  sortOrderSetting: 'asc' | 'desc';
}

const InventoryView = ({
  categories,
  inventory,
  locations,
  onSelectItem,
  showArchived,
  sortColSetting,
  sortOrderSetting,
}: Props) => {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(sortOrderSetting);
  const [sortCol, setSortCol] = useState(sortColSetting);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategories, setSearchCategories] = useState<Array<string>>([]);
  const [searchLocations, setSearchLocations] = useState<Array<string>>([]);

  const onSortChange = (col: string) => {
    if (sortCol !== col) {
      setSortCol(col);
      setSortOrder(DESC);
      window.electron.ipcRenderer.updateFileSettings({
        sortCol: col,
        sortOrder: DESC,
      });
    } else {
      const newSortOrder = sortOrder === ASC ? DESC : ASC;
      setSortOrder(newSortOrder);
      window.electron.ipcRenderer.updateFileSettings({
        sortOrder: newSortOrder,
      });
    }
  };

  const items = sortAndFilter({
    searchTerm,
    categories,
    inventory,
    locations,
    searchCategories,
    searchLocations,
    showArchived,
    sortCol,
    sortOrder,
  });

  return (
    <Box width="100%" paddingX={4}>
      <InventorySearch
        categories={categories}
        locations={locations}
        searchTerm={searchTerm}
        searchCategories={searchCategories}
        searchLocations={searchLocations}
        setSearchCategories={setSearchCategories}
        setSearchLocations={setSearchLocations}
        setSearchTerm={setSearchTerm}
      />

      <Table accessibilityLabel="Inventory table" maxHeight="100vh">
        <Table.Header sticky>
          <Table.Row>
            {inventoryItemAttributes.map((attr) => (
              <HeaderCell
                key={`header-${attr}`}
                attr={attr}
                onSortChange={onSortChange}
                sortCol={sortCol}
                sortOrder={sortOrder}
              />
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items.map((item) => (
            <Row key={item.id} item={item} handleTap={onSelectItem} />
          ))}
        </Table.Body>
      </Table>
    </Box>
  );
};

export default InventoryView;
