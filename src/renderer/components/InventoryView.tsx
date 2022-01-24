import { Box, Table, TapArea, Text } from 'gestalt';
import { useState } from 'react';
import InventoryItem from '../../Inventory/InventoryItem';
// import { Link } from 'react-router-dom';

const inventoryItemAttributes = Object.getOwnPropertyNames(
  new InventoryItem({ id: '', name: '', archived: false })
).filter((attr) => !['id', 'archived'].includes(attr));

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

function HeaderCell({ txt }: { txt: string }) {
  return (
    <Table.HeaderCell>
      <Text weight="bold">{txt}</Text>
    </Table.HeaderCell>
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
            <Text>{item[attr].toString()}</Text>
          </Table.Cell>
        );
      })}
    </tr>
  );
}

interface Props {
  inventory: Array<InventoryItem>;
  onSelectItem: (item: InventoryItem | null) => void;
}

const InventoryView = ({ inventory, onSelectItem }: Props) => {
  const filteredItems = inventory.filter((itm) => !itm.archived);

  return (
    <Box width="100%">
      <Table accessibilityLabel="Inventory table">
        <Table.Header sticky>
          <Table.Row>
            {inventoryItemAttributes.map((attr) => (
              <HeaderCell
                key={`header-${attr}`}
                txt={camelCaseToSentence(attr)}
              />
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {filteredItems.map((item) => (
            <Row key={item.id} item={item} handleTap={onSelectItem} />
          ))}
        </Table.Body>
      </Table>
    </Box>
  );
};

export default InventoryView;
