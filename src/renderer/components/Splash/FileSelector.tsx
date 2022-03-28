import { Box, Button, Divider, Flex, Link, Text, SelectList } from 'gestalt';

const PATH_CHARACTER_LIMIT = 36;

function makeSelectListOptions(filepaths: Array<string>) {
  return filepaths.map((filepath) => {
    // TODO: Handle both linux and Windows filepaths
    const pathParts = filepath.split(/\//).filter(Boolean);

    let label = '';
    for (let i = pathParts.length - 1; i >= 0; i -= 1) {
      const newSegment = `/${pathParts[i]}`;
      if (label.length + newSegment.length < PATH_CHARACTER_LIMIT) {
        label = newSegment + label;
      } else {
        label = `...${label}`;
        break;
      }
    }

    return { label, value: filepath };
  });
}
interface Props {
  handleFileSelected: (value: string) => void;
  recentFiles: Array<string>;
  selectedRecentFile: string;
}

const FileSelector = (props: Props) => {
  const { handleFileSelected, recentFiles, selectedRecentFile } = props;

  const list =
    recentFiles.length > 0 ? (
      <Box display="flex" direction="row" alignItems="end">
        <Box width="100%">
          <SelectList
            id="recent-files"
            label="Recently opened"
            options={makeSelectListOptions(recentFiles)}
            onChange={({ value }) => handleFileSelected(value)}
            value={selectedRecentFile}
          />
        </Box>

        <Box marginStart={4}>
          <Button
            text="Open"
            color="blue"
            onClick={() =>
              window.electron.ipcRenderer.openRecentInventory(
                selectedRecentFile || recentFiles[0]
              )
            }
          />
        </Box>
      </Box>
    ) : null;

  return (
    <>
      <Box paddingX={8} paddingY={2}>
        <Flex direction="column" gap={4}>
          {list}
          {list && <Divider />}

          <Box display="flex" direction="column">
            <Box marginBottom={2}>
              <Button
                text="Open an inventory"
                color="blue"
                onClick={() =>
                  window.electron.ipcRenderer.openExistingInventory()
                }
                fullWidth
              />
            </Box>

            <Button
              text="Create a new inventory"
              color="blue"
              onClick={() => window.electron.ipcRenderer.createNewInventory()}
            />
          </Box>
        </Flex>
      </Box>

      <Box
        direction="row"
        display="flex"
        justifyContent="center"
        paddingX={12}
        paddingY={4}
        marginBottom={2}
      >
        <Text size="200">
          Consider supporting Minute Inventory. Buy me a{' '}
          <Text inline size="200" weight="bold" color="watermelon">
            <Link
              accessibilityLabel="https://ko-fi.com/mminute"
              href="https://ko-fi.com/mminute"
              inline
              target="blank"
            >
              coffee!
            </Link>
          </Text>
        </Text>
      </Box>
    </>
  );
};

export default FileSelector;
