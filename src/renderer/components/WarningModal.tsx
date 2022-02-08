import { Box, Button, Flex, Modal, Text } from 'gestalt';

interface Props {
  onDismiss: () => void;
  // eslint-disable-next-line react/no-unused-prop-types
  warningType: 'unsaved-changes';
  actionType: 'new-file' | 'existing-file';
}

const handlers = {
  'new-file': {
    abandonChanges: window.electron.ipcRenderer.unsafeCreateNewInventory,
    saveAndProceed: window.electron.ipcRenderer.saveAndCreateNewInventory,
  },
  'existing-file': {
    abandonChanges: window.electron.ipcRenderer.unsafeOpenExistingInventory,
    saveAndProceed: window.electron.ipcRenderer.saveAndOpenExistingInventory,
  },
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function WarningModal({ actionType, onDismiss }: Props) {
  const headingText = 'You have unsaved changes!';

  const { abandonChanges, saveAndProceed } = handlers[actionType];

  console.log(actionType);

  return (
    <Modal
      accessibilityModalLabel={headingText}
      heading={headingText}
      onDismiss={onDismiss}
      footer={
        <Flex direction="row" gap={2} justifyContent="end">
          <Button text="Cancel" onClick={onDismiss} />

          <Button
            text="Abandon Changes"
            color="red"
            onClick={() => {
              abandonChanges();
              onDismiss();
            }}
          />

          <Button
            text="Save and proceed"
            color="blue"
            onClick={() => {
              saveAndProceed();
              onDismiss();
            }}
          />
        </Flex>
      }
    >
      <Box padding={8}>
        <Flex direction="column" gap={4}>
          <Text>
            Your changes will be lost unless you save. Confirm whether you wish
            to abandon your changes and open a different file or if you wish to
            save your changes before proceeding.
          </Text>
        </Flex>
      </Box>
    </Modal>
  );
}

export default WarningModal;
