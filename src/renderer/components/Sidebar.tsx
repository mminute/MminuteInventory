import './Sidebar.css';
import { Box, Button, Flex, Divider, Text } from 'gestalt';
import { useLocation, useNavigate } from 'react-router-dom';
import { CollapsedSidebarRoutes } from '../../consts/routePaths';

const filepathDelimiter = '/';

interface Props {
  filepath: string;
  saveDisabled: boolean;
  onAddNewItem: () => void;
}

function Sidebar({ filepath, onAddNewItem, saveDisabled }: Props) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const left = CollapsedSidebarRoutes.includes(pathname) ? -190 : 0;

  const pathParts = filepath.split(filepathDelimiter);
  const filename = pathParts[pathParts.length - 1];

  return (
    <div className="sidebar sidebar-transition" style={{ left: `${left}px` }}>
      <Flex direction="column" height="100vh">
        <Flex direction="column" gap={2}>
          <Text>{filename}</Text>
          <Divider />
          <Button
            color="blue"
            text="Add item"
            size="sm"
            fullWidth
            onClick={onAddNewItem}
          />

          <div
            className={`saveButtonWrapper-${
              saveDisabled ? 'disabled' : 'enabled'
            } ${saveDisabled ? '' : 'pulse-button'}`}
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
        </Flex>

        <Box marginTop="auto" marginBottom={6}>
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

            <Button
              accessibilityLabel="Settings"
              color="white"
              fullWidth
              iconEnd="cog"
              text="Settings"
              onClick={() => navigate('/settings')}
            />
          </Flex>
        </Box>
      </Flex>
    </div>
  );
}

export default Sidebar;
