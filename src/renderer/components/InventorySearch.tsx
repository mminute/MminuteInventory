import { Box, Flex, IconButton, SearchField } from 'gestalt';
import { useState } from 'react';
import InventorySearchFilterPanel from './InventorySearchFilterPanel';

interface Props {
  categories: Array<string>;
  locations: Array<string>;
  searchTerm: string;
  setSearchCategories: (selected: Array<string>) => void;
  setSearchLocations: (selected: Array<string>) => void;
  setSearchTerm: (value: string) => void;
}

function InventorySearch({
  categories,
  locations,
  searchTerm,
  setSearchCategories,
  setSearchLocations,
  setSearchTerm,
}: Props) {
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  return (
    <>
      <Box paddingY={3}>
        <Flex direction="row" gap={2}>
          <SearchField
            accessibilityLabel="Search your items"
            accessibilityClearButtonLabel="Clear your search"
            id="item-search-field"
            placeholder="Search your items"
            onChange={({ value }) => setSearchTerm(value)}
            value={searchTerm}
          />

          <IconButton
            accessibilityLabel="Filter your search"
            icon="filter"
            onClick={() => setShowFilterPanel(true)}
          />
        </Flex>
      </Box>

      {showFilterPanel && (
        <InventorySearchFilterPanel
          categories={categories}
          locations={locations}
          onDismiss={() => setShowFilterPanel(false)}
          originalSearchTerm={searchTerm}
          setOriginalSearchTerm={setSearchTerm}
          setSearchCategories={setSearchCategories}
          setSearchLocations={setSearchLocations}
        />
      )}
    </>
  );
}

export default InventorySearch;
