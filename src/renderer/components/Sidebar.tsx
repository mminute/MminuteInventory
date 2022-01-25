import './Sidebar.css';
import { Button, Flex, Divider } from 'gestalt';

interface Props {
  saveDisabled: boolean;
  onAddNewItem: () => void;
}

function Sidebar({ onAddNewItem, saveDisabled }: Props) {
  return (
    <div className="sidebar">
      <Flex direction="column" gap={2}>
        <Button
          color="blue"
          text="New inventory"
          size="sm"
          fullWidth
          onClick={() => {
            window.electron.ipcRenderer.createNewInventory();
          }}
        />

        <Button
          color="blue"
          text="Open inventory"
          size="sm"
          fullWidth
          onClick={() => {
            window.electron.ipcRenderer.openExistingInventory();
          }}
        />

        <Divider />

        <div
          className={`saveButtonWrapper-${
            saveDisabled ? 'disabled' : 'enabled'
          }`}
        >
          <Button
            color="red"
            disabled={saveDisabled}
            text="Save"
            size="sm"
            fullWidth
            onClick={() => {
              window.electron.ipcRenderer.saveInventory();
            }}
          />
        </div>

        <Divider />

        <Button
          color="blue"
          text="Add item"
          size="sm"
          fullWidth
          onClick={onAddNewItem}
        />
      </Flex>
    </div>
  );
}

export default Sidebar;
