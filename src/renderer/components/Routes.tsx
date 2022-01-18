import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import routePaths from 'consts/routePaths';
import Hello from './Hello';
import World from './World';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path={routePaths.HOME} element={<Hello />} />
        <Route path={routePaths.WORLD} element={<World />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
