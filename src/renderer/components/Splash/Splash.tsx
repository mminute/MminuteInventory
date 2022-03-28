import { routePaths } from 'consts/routePaths';
import { Modal } from 'gestalt';
import React from 'react';
import { Navigate } from 'react-router-dom';
import actions from '../../../consts/actions';
import FileSelector from './FileSelector';
import InvalidFile from './InvalidFile';

const HEADING = 'Welcome to Minute Inventory';

interface Props {
  recentFiles: Array<string>;
}

interface State {
  error: {
    type: 'invalid-file' | 'invalid-file-migratable';
    filepath: string;
  } | null;
  selectedRecentFile: string;
  shouldRedirect: boolean;
}

class Splash extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: null,
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

    window.electron.ipcRenderer.on(
      actions.INVALID_FILE_SELECTED,
      this.handleInvalidFileSelected
    );

    window.electron.ipcRenderer.on(
      actions.INVALID_FILE_SELECTED_MIGRATABLE,
      this.handleInvalidFileSelectedMigratable
    );
  }

  componentWillUnmount() {
    window.electron.ipcRenderer.removeAllListeners(
      [actions.INVENTORY_CREATED, actions.INVENTORY_OPENED],
      this.handleInventorySelected
    );

    window.electron.ipcRenderer.removeAllListeners(
      [actions.INVALID_FILE_SELECTED],
      this.handleInvalidFileSelected
    );

    window.electron.ipcRenderer.removeAllListeners(
      [actions.INVALID_FILE_SELECTED_MIGRATABLE],
      this.handleInvalidFileSelectedMigratable
    );
  }

  handleInventorySelected = () => {
    this.setState({ shouldRedirect: true });
  };

  handleInvalidFileSelected = (filepath: string) => {
    this.setState({ error: { type: 'invalid-file', filepath } });
  };

  handleInvalidFileSelectedMigratable = (filepath: string) => {
    this.setState({ error: { type: 'invalid-file-migratable', filepath } });
  };

  render() {
    const { error, selectedRecentFile, shouldRedirect } = this.state;
    const { recentFiles } = this.props;

    if (shouldRedirect) {
      return <Navigate to={routePaths.VIEW} />;
    }

    let modalHeading = HEADING;
    let contents;

    if (error) {
      modalHeading = 'Invalid File Selected';
      contents = (
        <InvalidFile
          error={error}
          onClose={() => this.setState({ error: null })}
        />
      );
    } else {
      contents = (
        <FileSelector
          handleFileSelected={(value) =>
            this.setState({ selectedRecentFile: value })
          }
          recentFiles={recentFiles}
          selectedRecentFile={selectedRecentFile}
        />
      );
    }

    return (
      <Modal
        accessibilityModalLabel={modalHeading}
        heading={modalHeading}
        onDismiss={() => {}}
      >
        {contents}
      </Modal>
    );
  }
}

export default Splash;
