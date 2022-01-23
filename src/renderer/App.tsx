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
  categories: Array<string>;
  locations: Array<string>;
  currentItem: InventoryItem | null;
  showSheet: boolean;
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
    };
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

  handleInventoryUpdated = (
    inventory: Array<InventoryItem>,
    categories: Set<string>,
    locations: Set<string>
  ) => {
    this.setState({
      inventory,
      categories: Array.from(categories),
      locations: Array.from(locations),
    });
  };

  handleSelectItem = (item: InventoryItem | null) => {
    this.setState((prevState) => {
      return { showSheet: !prevState.showSheet, currentItem: item };
    });
  };

  render() {
    const { inventory, categories, locations, currentItem, showSheet } =
      this.state;

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
            categories={categories}
            item={currentItem}
            locations={locations}
            onDismiss={() => this.handleSelectItem(null)}
          />
        )}
      </>
    );
  }
}

export default App;
