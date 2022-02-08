import './Sidebar.css';
import { Box, Button, Flex, Divider } from 'gestalt';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { CollapsedSidebarRoutes } from '../../consts/routePaths';

interface Props {
  saveDisabled: boolean;
  onAddNewItem: () => void;
}

function Sidebar({ onAddNewItem, saveDisabled }: Props) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const left = CollapsedSidebarRoutes.includes(pathname) ? -190 : 0;

  return (
    <div className="sidebar sidebar-transition" style={{ left: `${left}px` }}>
      <Flex direction="column" height="100vh">
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

        <Box marginTop="auto" marginBottom={6}>
          <Button
            accessibilityLabel="Settings"
            color="white"
            fullWidth
            iconEnd="cog"
            text="Settings"
            onClick={() => navigate('/settings')}
          />
        </Box>
      </Flex>
    </div>
  );
}

export default Sidebar;
