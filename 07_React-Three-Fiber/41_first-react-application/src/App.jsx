import { useState } from 'react';
import Clicker from './Clicker';

const App = () => {
  const [showClicker, setShowClicker] = useState(true);

  return (
    <>
      <button onClick={() => setShowClicker(!showClicker)}>
        {showClicker ? 'Hide' : 'Show'} Clicker
      </button>
      {showClicker && <Clicker />}
    </>
  );
};

export default App;
