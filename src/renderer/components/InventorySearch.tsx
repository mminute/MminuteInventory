import { Box, Flex, IconButton, SearchField, Tag, Text } from 'gestalt';
import { useState } from 'react';
import InventorySearchFilterPanel from './InventorySearchFilterPanel';

interface Props {
  categories: Array<string>;
  locations: Array<string>;
  searchCategories: Array<string>;
  searchLocations: Array<string>;
  searchTerm: string;
  setSearchCategories: (selected: Array<string>) => void;
  setSearchLocations: (selected: Array<string>) => void;
  setSearchTerm: (value: string) => void;
}

function InventorySearch({
  categories,
  locations,
  searchCategories,
  searchLocations,
  searchTerm,
  setSearchCategories,
  setSearchLocations,
  setSearchTerm,
}: Props) {
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  return (
    <>
      <Box paddingY={3}>
        <Flex direction="row" flex="grow" gap={2}>
          <Flex.Item flex="grow">
            <SearchField
              accessibilityLabel="Search your items"
              accessibilityClearButtonLabel="Clear your search"
              id="item-search-field"
              placeholder="Search your items"
              onChange={({ value }) => setSearchTerm(value)}
              value={searchTerm}
            />
          </Flex.Item>

          <IconButton
            accessibilityLabel="Filter your search"
            icon="filter"
            onClick={() => setShowFilterPanel(true)}
          />
        </Flex>

        {searchCategories.length > 0 && (
          <Box marginTop={2}>
            <Box marginBottom={1}>
              <Text size="100">Categories:</Text>
            </Box>

            <Flex direction="row" gap={2}>
              {searchCategories.map((option) => (
                <Tag
                  key={option}
                  onRemove={() =>
                    setSearchCategories(
                      searchCategories.filter((c) => c !== option)
                    )
                  }
                  removeIconAccessibilityLabel={`Remove ${option}`}
                  text={option}
                />
              ))}
            </Flex>
          </Box>
        )}

        {searchLocations.length > 0 && (
          <Box marginTop={2}>
            <Box marginBottom={1}>
              <Text size="100">Locations:</Text>
            </Box>

            <Flex direction="row" gap={2}>
              {searchLocations.map((option) => (
                <Tag
                  key={option}
                  onRemove={() =>
                    setSearchLocations(
                      searchLocations.filter((l) => l !== option)
                    )
                  }
                  removeIconAccessibilityLabel={`Remove ${option}`}
                  text={option}
                />
              ))}
            </Flex>
          </Box>
        )}
      </Box>

      {showFilterPanel && (
        <InventorySearchFilterPanel
          categories={categories}
          locations={locations}
          onDismiss={() => setShowFilterPanel(false)}
          originalSearchTerm={searchTerm}
          searchCategories={searchCategories}
          searchLocations={searchLocations}
          setOriginalSearchTerm={setSearchTerm}
          setSearchCategories={setSearchCategories}
          setSearchLocations={setSearchLocations}
        />
      )}
    </>
  );
}

export default InventorySearch;
