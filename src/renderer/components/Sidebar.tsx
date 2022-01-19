import './Sidebar.css';
import { Button, Flex, Divider } from 'gestalt';

function Sidebar() {
  return (
    <div className="sidebar">
      <Flex direction="column" gap={2}>
        <Button color="blue" text="New inventory" size="sm" fullWidth />
        <Button color="blue" text="Open inventory" size="sm" fullWidth />
        <Divider />
        <Button color="blue" text="Add item" size="sm" fullWidth />
      </Flex>
    </div>
  );
}

export default Sidebar;
