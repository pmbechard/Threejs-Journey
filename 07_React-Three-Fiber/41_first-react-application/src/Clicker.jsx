import { useEffect, useRef, useState } from 'react';

const Clicker = ({ keyName, color, increment, decrement }) => {
  const [count, setCount] = useState(
    parseInt(localStorage.getItem(keyName) ?? 0)
  );

  const incrementBtnRef = useRef();
  const decrementBtnRef = useRef();

  useEffect(() => {
    incrementBtnRef.current.style.backgroundColor = 'rgb(30, 114, 30)';
    decrementBtnRef.current.style.backgroundColor = 'rgb(125, 39, 39)';
    return () => localStorage.removeItem(keyName);
  }, []);

  useEffect(() => {
    localStorage.setItem(keyName, count);
  }, [count]);

  return (
    <div style={{ backgroundColor: color, padding: '20px' }}>
      <p>Count: {count}</p>
      <button
        ref={incrementBtnRef}
        onClick={() => {
          setCount(count + 1);
          increment();
        }}
      >
        Increment
      </button>
      <button
        ref={decrementBtnRef}
        onClick={() => {
          setCount(count - 1);
          decrement();
        }}
      >
        Decrement
      </button>
    </div>
  );
};

export default Clicker;
