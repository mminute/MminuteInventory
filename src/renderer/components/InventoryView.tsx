import { Box, Table, TapArea, Text } from 'gestalt';
import InventoryItem from '../../Inventory/InventoryItem';

const inventoryItemAttributes = Object.getOwnPropertyNames(
  new InventoryItem({ id: '', name: '', archived: false, quantity: 1 })
).filter(
  (attr) =>
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
            <Text color={item.archived ? 'gray' : 'darkGray'}>
              {item[attr].toString()}
            </Text>
          </Table.Cell>
        );
      })}
    </tr>
  );
}

interface Props {
  inventory: Array<InventoryItem>;
  onSelectItem: (item: InventoryItem | null) => void;
  showArchived: boolean;
}

const InventoryView = ({ inventory, onSelectItem, showArchived }: Props) => {
  const items = showArchived
    ? inventory
    : inventory.filter((itm) => !itm.archived);

  return (
    <Box width="100%" paddingX={4}>
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
          {items.map((item) => (
            <Row key={item.id} item={item} handleTap={onSelectItem} />
          ))}
        </Table.Body>
      </Table>
    </Box>
  );
};

export default InventoryView;
