import React from 'react';
import Routes from './components/Routes';
import Sidebar from './components/Sidebar';
import './App.css';
import actions from '../consts/actions';
import InventoryItem from '../Inventory/InventoryItem';
import { Flex } from 'gestalt';
import 'gestalt/dist/gestalt.css';

class App extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { inventory: [] };
  }

  componentDidMount() {
    window.electron.ipcRenderer.on(
      actions.INVENTORY_INITIALIZED,
      this.handleInventoryUpdated
    );
  }

  componentWillUnmount() {
    window.electron.ipcRenderer.removeAllListeners(
      [actions.INVENTORY_INITIALIZED],
      this.handleInventoryUpdated
    );
  }

  handleInventoryUpdated = (data: Array<InventoryItem>) => {
    this.setState({ inventory: data });
  };

  render() {
    return (
      <div className="appMain">
        <Flex>
          <Sidebar />
          <Routes />
        </Flex>
      </div>
    );
  }
}

export default App;
