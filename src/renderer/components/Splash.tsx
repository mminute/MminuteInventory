import routePaths from 'consts/routePaths';
import { Box, Button, Divider, Flex, Modal, SelectList } from 'gestalt';
import React from 'react';
import { Navigate } from 'react-router-dom';
import actions from '../../consts/actions';

const heading = 'Welcome to Minute Inventory';

class Splash extends React.Component<
  Record<string, never>,
  { shouldRedirect: boolean }
> {
  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      shouldRedirect: false,
    };
  }

  componentDidMount() {
    window.electron.ipcRenderer.on(
      actions.INVENTORY_CREATED,
      this.handleInventorySelected
    );

    window.electron.ipcRenderer.on(
      actions.INVENTORY_OPENED,
      this.handleInventorySelected
    );
  }

  componentWillUnmount() {
    window.electron.ipcRenderer.removeAllListeners(
      [actions.INVENTORY_CREATED, actions.INVENTORY_OPENED],
      this.handleInventorySelected
    );
  }

  handleInventorySelected = () => {
    this.setState({ shouldRedirect: true });
  };

  render() {
    const { shouldRedirect } = this.state;

    if (shouldRedirect) {
      return <Navigate to={routePaths.VIEW} />;
    }

    return (
      <Modal
        accessibilityModalLabel={heading}
        heading={heading}
        onDismiss={() => {}}
      >
        <Box padding={8}>
          <Flex direction="column" gap={4}>
            <Box display="flex" direction="row" alignItems="end">
              <Box width="100%">
                <SelectList
                  id="recent-files"
                  label="Recently opened"
                  options={[]}
                  onChange={() => {}}
                />
              </Box>

              <Box marginStart={4}>
                <Button text="Open" color="blue" onClick={() => {}} />
              </Box>
            </Box>

            <Divider />
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
      </Modal>
    );
  }
}

export default Splash;
