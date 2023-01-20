import { useEffect, useState } from 'react';

const Clicker = () => {
  const [count, setCount] = useState(
    parseInt(localStorage.getItem('count') ?? 0)
  );

  useEffect(() => {
    return () => localStorage.removeItem('count');
  }, []);

  useEffect(() => {
    localStorage.setItem('count', count);
  }, [count]);

  return (
    <>
      <p>Count: {count}</p>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        Increment
      </button>
      <button
        onClick={() => {
          setCount(count - 1);
        }}
      >
        Decrement
      </button>
    </>
  );
};

export default Clicker;
