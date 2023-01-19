import { createRoot } from 'react-dom/client';
import './style.css';

const title = 'Hello, React';

createRoot(document.getElementById('root')).render(
  <>
    <h1 className='title'>{title}</h1>
    <h2 style={{ color: 'coral', backgroundColor: 'floralwhite' }}>Subtitle</h2>
    <p className='cute-paragraph'>
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illo eveniet,
      dolor dolorum magni repellat enim natus ea voluptate id quas neque
      voluptates, tenetur praesentium! Libero natus officia nesciunt aliquid
      rerum.
    </p>
    <p>Random number: {parseInt(Math.random() * 10 + 1)}</p>
    <br />
    {/* Comments */}
    <input type='checkbox' id='cb' />
    <label htmlFor='cb'>Check me</label>
  </>
);
