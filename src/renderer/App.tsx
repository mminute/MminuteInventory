import React from 'react';
import routePaths from 'consts/routePaths';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import './App.css';
import 'gestalt/dist/gestalt.css';
import actions from '../consts/actions';
import InventoryItem from '../Inventory/InventoryItem';
import InventoryView from './components/InventoryView';
import ViewAndEditItemSheet from './components/ViewAndEditItemSheet';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}
interface State {
  inventory: Array<InventoryItem>;
  currentItem: InventoryItem | null;
  showSheet: boolean;
}

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { inventory: [], currentItem: null, showSheet: false };
  }

  componentDidMount() {
    window.electron.ipcRenderer.on(
      actions.INVENTORY_INITIALIZED,
      this.handleInventoryUpdated
    );

    window.electron.ipcRenderer.on(
      actions.INVENTORY_UPDATED,
      this.handleInventoryUpdated
    );
  }

  componentWillUnmount() {
    window.electron.ipcRenderer.removeAllListeners(
      [actions.INVENTORY_INITIALIZED, actions.INVENTORY_UPDATED],
      this.handleInventoryUpdated
    );
  }

  handleInventoryUpdated = (data: Array<InventoryItem>) => {
    this.setState({ inventory: data });
  };

  handleSelectItem = (item: InventoryItem | null) => {
    this.setState((prevState) => {
      return { showSheet: !prevState.showSheet, currentItem: item };
    });
  };

  render() {
    const { inventory, currentItem, showSheet } = this.state;

    return (
      <>
        <div className="appMain">
          <Sidebar />
          <Router>
            <Routes>
              <Route
                path={routePaths.HOME}
                element={
                  <InventoryView
                    inventory={inventory}
                    onSelectItem={this.handleSelectItem}
                  />
                }
              />
            </Routes>
          </Router>
        </div>
        {showSheet && currentItem && (
          <ViewAndEditItemSheet
            item={currentItem}
            onDismiss={() => this.handleSelectItem(null)}
          />
        )}
      </>
    );
  }
}

export default App;
