import { createRoot } from 'react-dom/client';
import App from './App';

import './style.css';

createRoot(document.getElementById('root')).render(
  <>
    <App clickerCount={3}>
      <h1>Reactive Counter</h1>
      <h2>Made with React</h2>
    </App>
  </>
);
