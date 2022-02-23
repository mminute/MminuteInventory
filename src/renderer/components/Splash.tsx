import { routePaths } from 'consts/routePaths';
import { Box, Button, Divider, Flex, Modal, SelectList } from 'gestalt';
import React from 'react';
import { Navigate } from 'react-router-dom';
import actions from '../../consts/actions';

const HEADING = 'Welcome to Minute Inventory';
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
  recentFiles: Array<string>;
}

interface State {
  selectedRecentFile: string,
  shouldRedirect: boolean;
}

class Splash extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedRecentFile: props.recentFiles[0],
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
    const { selectedRecentFile, shouldRedirect } = this.state;
    const { recentFiles } = this.props;

    if (shouldRedirect) {
      return <Navigate to={routePaths.VIEW} />;
    }

    const list =
      recentFiles.length > 0 ? (
        <Box display="flex" direction="row" alignItems="end">
          <Box width="100%">
            <SelectList
              id="recent-files"
              label="Recently opened"
              options={makeSelectListOptions(recentFiles)}
              onChange={({ value }) => {
                this.setState({ selectedRecentFile: value });
              }}
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
      <Modal
        accessibilityModalLabel={HEADING}
        heading={HEADING}
        onDismiss={() => {}}
      >
        <Box padding={8}>
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
      </Modal>
    );
  }
}

export default Splash;
