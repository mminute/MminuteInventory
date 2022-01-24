import './Sidebar.css';
import { Button, Flex, Divider } from 'gestalt';

interface Props {
  onAddNewItem: () => void;
}

function Sidebar({ onAddNewItem }: Props) {
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

        <Button
          color="red"
          disabled
          text="Save"
          size="sm"
          fullWidth
          onClick={() => {
            // window.electron.ipcRenderer.openExistingInventory();
            console.log('tap Save');
          }}
        />

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
