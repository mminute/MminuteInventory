import { useState } from 'react';
import { Box, Table, Text } from 'gestalt';
import InventoryItem from '../../Inventory/InventoryItem';

const ASC = 'asc';
const DESC = 'desc';

const inventoryItemAttributes = Object.getOwnPropertyNames(
  new InventoryItem({ id: '', name: '', archived: false, quantity: 1 })
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
      <Text weight="bold">{camelCaseToSentence(attr)}</Text>
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
        return (
          <Table.Cell key={attr}>
            <Text color={item.archived ? 'gray' : 'darkGray'}>
              {item[attr].toString()}
            </Text>
          </Table.Cell>
        );
      })}
    </tr>
  );
}

function sortAndFilter({
  inventory,
  showArchived,
  sortCol,
  sortOrder,
}: {
  inventory: Array<InventoryItem>;
  showArchived: boolean;
  sortCol: string;
  sortOrder: 'asc' | 'desc';
}): Array<InventoryItem> {
  const sortOrderValue = sortOrder === ASC ? -1 : 1;

  const items = showArchived
    ? inventory
    : inventory.filter((itm) => !itm.archived);

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
  inventory: Array<InventoryItem>;
  onSelectItem: (item: InventoryItem | null) => void;
  showArchived: boolean;
}

const InventoryView = ({ inventory, onSelectItem, showArchived }: Props) => {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(DESC);
  const [sortCol, setSortCol] = useState(inventoryItemAttributes[0]);

  const onSortChange = (col: string) => {
    if (sortCol !== col) {
      setSortCol(col);
      setSortOrder(DESC);
    } else {
      setSortOrder(sortOrder === ASC ? DESC : ASC);
    }
  };

  const items = sortAndFilter({ inventory, showArchived, sortCol, sortOrder });

  return (
    <Box width="100%" paddingX={4}>
      <Table accessibilityLabel="Inventory table">
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
