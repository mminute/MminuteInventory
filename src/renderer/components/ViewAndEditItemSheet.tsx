import {
  Box,
  Button,
  Checkbox,
  ComboBox,
  Fieldset,
  FixedZIndex,
  Flex,
  Layer,
  RadioButton,
  Sheet,
  Text,
  TextArea,
  TextField,
} from 'gestalt';
import DatePicker from 'gestalt-datepicker';
import InventoryItem from '../../Inventory/InventoryItem';

interface Props {
  item: InventoryItem;
  onDismiss: () => void;
}

function ViewAndEditItemSheet({ item, onDismiss }: Props) {
  const handleUpdateItem = () => {
    window.electron.ipcRenderer.updateItem({
      id: item.id,
      name: 'updated name',
    });
  };

  return (
    <Layer zIndex={new FixedZIndex(0)}>
      <Sheet
        accessibilityDismissButtonLabel="Close view and edit item sheet"
        accessibilitySheetLabel="View or edit an item"
        heading="View or edit an item"
        onDismiss={onDismiss}
        footer={({ onDismissStart }) => (
          <Flex alignItems="center" justifyContent="end">
            <Button
              color="blue"
              text="Update"
              onClick={() => {
                handleUpdateItem();
                onDismissStart();
              }}
            />
          </Flex>
        )}
        size="md"
      >
        <Flex direction="column" gap={4}>
          <TextField
            id="item-id"
            label="Id"
            placeholder="Item id"
            onChange={() => {}}
          />

          <TextField
            id="item-name"
            label="Name"
            placeholder="Item name"
            onChange={() => {}}
          />

          <ComboBox
            accessibilityClearButtonLabel="Clear category value"
            errorMessage={undefined}
            id="item-category"
            label="Category"
            noResultText="No matching category found"
            onBlur={() => {}}
            onChange={() => {}}
            onClear={() => {}}
            options={[]}
            placeholder="Select a category"
          />

          <TextArea
            id="item-description"
            onChange={() => {}}
            placeholder="Describe your item..."
            label="Description"
            value={undefined}
          />

          <ComboBox
            accessibilityClearButtonLabel="Clear location value"
            errorMessage={undefined}
            id="item-location"
            label="Location"
            noResultText="No matching location found"
            onBlur={() => {}}
            onChange={() => {}}
            onClear={() => {}}
            options={[]}
            placeholder="Select a location"
          />

          <DatePicker
            id="item-acquired"
            label="Date acquired"
            onChange={() => {}}
          />

          <DatePicker
            id="item-relinquished"
            label="Date relinquished"
            onChange={() => {}}
          />

          <TextArea
            id="item-notes"
            onChange={() => {}}
            placeholder="Notes about your item..."
            label="Notes"
            value={undefined}
          />
        </Flex>
      </Sheet>
    </Layer>
  );
}

export default ViewAndEditItemSheet;
