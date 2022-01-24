import {
  Box,
  Button,
  ComboBox,
  FixedZIndex,
  Flex,
  Layer,
  Modal,
  Sheet,
  Text,
  TextArea,
  TextField,
} from 'gestalt';
import { useRef, useState } from 'react';
import InventoryItem from '../../Inventory/InventoryItem';

const modalTypes = {
  ARCHIVE: 'archive',
  DELETE: 'delete',
};

interface Props {
  categories: Array<string>;
  isNewItem: boolean;
  item: InventoryItem;
  locations: Array<string>;
  onDismiss: () => void;
}

function ViewAndEditItemSheet(props: Props) {
  const { categories, isNewItem, item, locations, onDismiss } = props;

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
  const [warningModalType, setWarningModalType] = useState<string | null>(null);

  const propsRef = useRef(props);

  const handleUpdateItem = (attributeOverrides: object = {}) => {
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
      ...{ ...updatedAttributes, ...attributeOverrides },
    });
  };

  const handleDeleteItem = () => {
    window.electron.ipcRenderer.deleteItem(item.id);
  };

  return (
    <Layer zIndex={new FixedZIndex(0)}>
      <Sheet
        accessibilityDismissButtonLabel="Close view and edit item sheet"
        accessibilitySheetLabel="View or edit an item"
        heading="View or edit an item"
        onDismiss={onDismiss}
        onAnimationEnd={() => {}}
        footer={({ onDismissStart }) => (
          <Flex direction="row" justifyContent="end">
            {!isNewItem && !propsRef.current.isNewItem && (
              <Box flex="grow">
                <Flex gap={4}>
                  <Button
                    text="Delete"
                    color="red"
                    onClick={() => {
                      setWarningModalType(modalTypes.DELETE);
                    }}
                  />

                  <Button
                    text="Archive"
                    onClick={() => {
                      setWarningModalType(modalTypes.ARCHIVE);
                    }}
                  />
                </Flex>
              </Box>
            )}

            <Flex alignItems="center" justifyContent="end" gap={4}>
              <Button
                text="Cancel"
                onClick={() => {
                  if (isNewItem) {
                    handleDeleteItem();
                  }

                  onDismissStart();
                }}
              />

              <Button
                color="blue"
                text={isNewItem ? 'Save' : 'Update'}
                onClick={() => {
                  handleUpdateItem();
                  onDismissStart();
                }}
              />
            </Flex>
          </Flex>
        )}
        size="md"
      >
        {({ onDismissStart }) => (
          <>
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

            {warningModalType && (
              <Layer zIndex={new FixedZIndex(10)}>
                <Modal
                  accessibilityModalLabel={
                    warningModalType === modalTypes.DELETE
                      ? 'Delete item'
                      : 'Archive item'
                  }
                  heading="Are you sure?"
                  onDismiss={() => setWarningModalType(null)}
                  footer={
                    <Flex justifyContent="end" gap={2}>
                      <Button
                        color="gray"
                        text="Cancel"
                        onClick={() => {
                          setWarningModalType(null);
                          onDismissStart();
                        }}
                      />

                      <Button
                        color="red"
                        text={
                          warningModalType === modalTypes.DELETE
                            ? 'Delete'
                            : 'Archive'
                        }
                        onClick={() => {
                          setWarningModalType(null);

                          if (warningModalType === modalTypes.DELETE) {
                            handleDeleteItem();
                          } else {
                            handleUpdateItem({ archived: true });
                          }

                          onDismissStart();
                        }}
                      />
                    </Flex>
                  }
                  size="sm"
                >
                  <Box padding={8}>
                    <Text align="center" size="lg">
                      {warningModalType === modalTypes.DELETE
                        ? 'Once you delete an item you cannot get it back'
                        : "Archived items are hidden by default. You will have to turn on the 'Show archived' setting"}
                    </Text>
                  </Box>
                </Modal>
              </Layer>
            )}
          </>
        )}
      </Sheet>
    </Layer>
  );
}

export default ViewAndEditItemSheet;
