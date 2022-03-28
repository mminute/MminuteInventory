import { Box, Button, Divider, Flex, Link, Text, SelectList } from 'gestalt';
import Schemas from '../../../Inventory/Schemas';

// const InvalidFileErrors = { invalid: 'invalid', migratable: 'migratable' };

interface Props {
  error: {
    type: 'invalid-file' | 'invalid-file-migratable';
    filepath: string;
  };
  onClose: () => void;
}

const InvalidFile = (props: Props) => {
  const { error, onClose } = props;

  return error.type === 'invalid-file' ? (
    <>
      <Box paddingX={8} paddingY={2}>
        <Flex direction="column" gap={3}>
          <Text>The file you have selected cannot be opened</Text>
          <Text>Valid files contain the following columns:</Text>
          <Box marginTop={-4}>
            <ul>
              {Schemas['v1.1.0'].split(',').map((attribute) => (
                <li key={attribute}>
                  <Text>{attribute}</Text>
                </li>
              ))}
            </ul>
          </Box>
        </Flex>
      </Box>

      <Box paddingX={4} paddingY={2} marginBottom={2}>
        <Flex direction="row" justifyContent="end">
          <Button text="OK" color="blue" onClick={onClose} />
        </Flex>
      </Box>
    </>
  ) : (
    <>
      <Box paddingX={8} paddingY={2} marginBottom={6}>
        <Text>
          The file you have selected must be updated before it can be used
        </Text>
      </Box>

      <Box paddingX={4} paddingY={2} marginBottom={2}>
        <Flex direction="row" justifyContent="between">
          <Button text="Cancel" onClick={onClose} />
          <Button
            text="Update"
            color="blue"
            onClick={() =>
              window.electron.ipcRenderer.upgradeInventoryFile(error.filepath)
            }
          />
        </Flex>
      </Box>
    </>
  );
};

export default InvalidFile;
