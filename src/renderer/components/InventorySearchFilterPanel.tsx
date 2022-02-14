import {
  Box,
  Button,
  FixedZIndex,
  Flex,
  Heading,
  Layer,
  SearchField,
  Sheet,
} from 'gestalt';
import { useState } from 'react';
import TagComboBox from './TagComboBox';

interface Props {
  categories: Array<string>;
  locations: Array<string>;
  onDismiss: () => void;
  originalSearchTerm: string;
  setOriginalSearchTerm: (value: string) => void;
  setSearchCategories: (selected: Array<string>) => void;
  setSearchLocations: (selected: Array<string>) => void;
}

function InventorySearchFilterPanel({
  categories,
  locations,
  onDismiss,
  originalSearchTerm,
  setOriginalSearchTerm,
  setSearchCategories,
  setSearchLocations,
}: Props) {
  const [searchTerm, setSearchTerm] = useState(originalSearchTerm);
  const [selectedCategories, setSelectedCategories] = useState<Array<string>>(
    []
  );
  const [selectedLocations, setSelectedLocations] = useState<Array<string>>([]);

  return (
    <Layer zIndex={new FixedZIndex(0)}>
      <Sheet
        accessibilityDismissButtonLabel="Close filter panel"
        accessibilitySheetLabel="Filter your search"
        heading="Filter your search"
        onDismiss={onDismiss}
        size="md"
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
              text="Search"
              onClick={() => {
                setOriginalSearchTerm(searchTerm);
                setSearchCategories(selectedCategories);
                setSearchLocations(selectedLocations);
                onDismissStart();
              }}
            />
          </Flex>
        )}
      >
        <Flex direction="column" gap={4}>
          <SearchField
            accessibilityLabel="Search your items"
            accessibilityClearButtonLabel="Clear your search"
            id="filter-panel-item-search-field"
            placeholder="Search your items"
            onChange={({ value }) => setSearchTerm(value)}
            value={searchTerm}
          />

          <Box marginTop={8}>
            <Heading size="300">Search these:</Heading>
            <Box paddingY={2}>
              <Flex direction="column" gap={4}>
                <TagComboBox
                  comboBoxLabel="Categories"
                  placeholder="Choose categories to search"
                  rawOptions={categories}
                  onSelection={(newCategories) =>
                    setSelectedCategories(newCategories)
                  }
                />

                <TagComboBox
                  comboBoxLabel="Locations"
                  placeholder="Choose locations to search"
                  rawOptions={locations}
                  onSelection={(newLocations) =>
                    setSelectedLocations(newLocations)
                  }
                />
              </Flex>
            </Box>
          </Box>
        </Flex>
      </Sheet>
    </Layer>
  );
}

// TODO: Scope search to name, category, description, location, notes

export default InventorySearchFilterPanel;
