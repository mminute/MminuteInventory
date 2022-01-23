import {
  Button,
  ComboBox,
  FixedZIndex,
  Flex,
  Layer,
  Sheet,
  Text,
  TextArea,
  TextField,
} from 'gestalt';
import { useState } from 'react';
import InventoryItem from '../../Inventory/InventoryItem';

interface Props {
  categories: Array<string>;
  item: InventoryItem;
  locations: Array<string>;
  onDismiss: () => void;
}

function ViewAndEditItemSheet({
  categories,
  item,
  locations,
  onDismiss,
}: Props) {
  const [name, setName] = useState(item.name);
  const [serialNumber, setSerialNumber] = useState(item.serialNumber);
  const [category, setCategory] = useState(item.category);
  const [description, setDescription] = useState(item.description);
  const [location, setLocation] = useState(item.location);
  const [dateAquired, setDateAquired] = useState(item.dateAcquired);
  const [dateRelinquished, setDateRelinquished] = useState(
    item.dateRelinquished
  );
  const [notes, setNotes] = useState(item.notes);

  const handleUpdateItem = () => {
    const allAttributes = {
      name,
      serialNumber,
      category,
      description,
      location,
      dateAquired,
      dateRelinquished,
      notes,
    };

    const updatedAttributes = {};

    Object.keys(allAttributes).forEach((attr) => {
      if (allAttributes[attr].trim() !== (item[attr] ? item[attr].trim() : '')) {
        updatedAttributes[attr] = allAttributes[attr].trim();
      }
    });

    window.electron.ipcRenderer.updateItem({
      id: item.id,
      ...updatedAttributes,
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
          <Flex alignItems="center" justifyContent="end" gap={4}>
            <Button
              text="Cancel"
              onClick={() => {
                onDismissStart();
              }}
            />

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
          <Text size="sm">Id: {item.id}</Text>

          <TextField
            id="item-name"
            label="Name"
            placeholder="Item name"
            onChange={({ value }) => setName(value)}
            value={name}
          />

          <TextField
            id="item-serial"
            label="Serial number"
            placeholder="Item Serial Number"
            onChange={({ value }) => setSerialNumber(value)}
            value={serialNumber}
          />

          <ComboBox
            accessibilityClearButtonLabel="Clear category value"
            errorMessage={undefined}
            id="item-category"
            label="Category"
            noResultText="No matching category found"
            onBlur={({ value }) => setCategory(value)}
            onChange={({ value }) => setCategory(value)}
            onClear={() => setCategory('')}
            onSelect={({ item: selectedCategory }) =>
              setCategory(selectedCategory.value)
            }
            options={categories.map((option) => ({
              label: option,
              value: option,
            }))}
            placeholder="Select a category"
            selectedOption={{ label: category, value: category }}
            inputValue={category}
          />

          <TextArea
            id="item-description"
            onChange={({ value }) => setDescription(value)}
            placeholder="Describe your item..."
            label="Description"
            value={description}
          />

          <ComboBox
            accessibilityClearButtonLabel="Clear location value"
            errorMessage={undefined}
            id="item-location"
            label="Location"
            noResultText="No matching location found"
            onBlur={({ value }) => setLocation(value)}
            onChange={({ value }) => setLocation(value)}
            onClear={() => setLocation('')}
            onSelect={({ item: selectedLocation }) =>
              setLocation(selectedLocation.value)
            }
            options={locations.map((option) => ({
              label: option,
              value: option,
            }))}
            placeholder="Select a location"
            selectedOption={{ label: location, value: location }}
            inputValue={location}
          />

          <Flex direction="row" gap={4}>
            <TextField
              id="item-acquired"
              label="Date acquired"
              placeholder="Date acquired"
              onChange={({ value }) => setDateAquired(value)}
              value={dateAquired}
              type="date"
            />

            <TextField
              id="item-relinquished"
              label="Date relinquished"
              placeholder="Date relinquished"
              onChange={({ value }) => setDateRelinquished(value)}
              value={dateRelinquished}
              type="date"
            />
          </Flex>

          <TextArea
            id="item-notes"
            onChange={({ value }) => setNotes(value)}
            placeholder="Notes about your item..."
            label="Notes"
            value={notes}
          />
        </Flex>
      </Sheet>
    </Layer>
  );
}

export default ViewAndEditItemSheet;
