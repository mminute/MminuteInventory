import Routes from './components/Routes';
import Sidebar from './components/Sidebar';
import './App.css';
import React from 'react';

class App extends React.Component {
  componentDidMount() {
    window.electron.ipcRenderer.on('updateApp', this.handleUpdateFromMain);
  }

  componentWillUnmount() {
    window.electron.ipcRenderer.removeAllListeners(
      ['updateApp'],
      this.handleUpdateFromMain
    );
  }

  handleUpdateFromMain() {
    console.log('handleUpdateFromMain!!!');
  }

  render() {
    return (
      <div className="appMain">
        <Sidebar />
        <Routes />
      </div>
    );
  }
}

export default App;

// export default function App() {
//   window.electron?.ipcRenderer?.myPong();
//   window.electron.ipcRenderer.on('updateApp', () => {
//     console.log('should update UI state from here');
//   });

//   return (
//     <div className="appMain">
//       <Sidebar />
//       <Routes />
//     </div>
//   );
// }
