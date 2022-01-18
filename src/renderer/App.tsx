import Routes from './components/Routes';
import Sidebar from './components/Sidebar';
import './App.css';

export default function App() {
  return (
    <div className="appMain">
      <Sidebar />
      <Routes />
    </div>
  );
}
