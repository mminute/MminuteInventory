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
import Splash from './components/Splash';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}
interface State {
  inventory: Array<InventoryItem>;
  categories: Array<string>;
  locations: Array<string>;
  currentItem: InventoryItem | null;
  showSheet: boolean;
  viewingNewItem: boolean;
  hasChanges: boolean;
  recentFiles: Array<string>;
}

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      inventory: [],
      categories: [],
      locations: [],
      currentItem: null,
      showSheet: false,
      viewingNewItem: false,
      hasChanges: false,
      recentFiles: [],
    };
  }

  componentDidMount() {
    window.electron.ipcRenderer.on(
      actions.INVENTORY_INITIALIZED,
      this.handleInventoryInitialized
    );

    window.electron.ipcRenderer.on(
      actions.INVENTORY_UPDATED,
      this.handleInventoryUpdated
    );

    window.electron.ipcRenderer.on(actions.ADD_NEW_ITEM, this.handleAddNewItem);

    window.electron.ipcRenderer.on(
      actions.INVENTORY_SAVED,
      this.handleInventorySaved
    );
  }

  componentWillUnmount() {
    window.electron.ipcRenderer.removeAllListeners(
      [actions.INVENTORY_INITIALIZED],
      this.handleInventoryInitialized
    );

    window.electron.ipcRenderer.removeAllListeners(
      [actions.INVENTORY_UPDATED],
      this.handleInventoryUpdated
    );

    window.electron.ipcRenderer.removeAllListeners(
      [actions.ADD_NEW_ITEM],
      this.handleAddNewItem
    );

    window.electron.ipcRenderer.removeAllListeners(
      [actions.INVENTORY_SAVED],
      this.handleInventorySaved
    );
  }

  handleInventoryInitialized = (
    inventory: Array<InventoryItem>,
    categories: Set<string>,
    locations: Set<string>,
    recentFiles: Array<string>
  ) => {
    this.setState({
      inventory,
      categories: Array.from(categories),
      locations: Array.from(locations),
      viewingNewItem: false,
      recentFiles,
    });
  };

  handleInventoryUpdated = (
    inventory: Array<InventoryItem>,
    categories: Set<string>,
    locations: Set<string>,
    hasChanges: boolean
  ) => {
    this.setState({
      inventory,
      categories: Array.from(categories),
      locations: Array.from(locations),
      viewingNewItem: false,
      hasChanges,
    });
  };

  handleSelectItem = (item: InventoryItem | null) => {
    this.setState((prevState) => {
      return { showSheet: !prevState.showSheet, currentItem: item };
    });
  };

  handleAddNewItem = (newItem: InventoryItem, hasChanges: boolean) => {
    this.setState({
      showSheet: true,
      currentItem: newItem,
      viewingNewItem: true,
      hasChanges,
    });
  };

  handleInventorySaved = (hasChanges: boolean) => {
    this.setState({ hasChanges });
  };

  render() {
    const {
      categories,
      currentItem,
      inventory,
      locations,
      showSheet,
      viewingNewItem,
      hasChanges,
      recentFiles,
    } = this.state;

    return (
      <>
        <div className="appMain">
          <Sidebar
            saveDisabled={!hasChanges}
            onAddNewItem={() => {
              window.electron.ipcRenderer.addNewItem();
            }}
          />
          <Router>
            <Routes>
              <Route
                path={routePaths.HOME}
                element={<Splash recentFiles={recentFiles} />}
              />
              <Route
                path={routePaths.VIEW}
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
            categories={categories}
            item={currentItem}
            isNewItem={viewingNewItem}
            locations={locations}
            onDismiss={() => this.handleSelectItem(null)}
          />
        )}
      </>
    );
  }
}

export default App;
