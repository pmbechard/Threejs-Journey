import { useEffect, useMemo, useState } from 'react';
import Clicker from './Clicker';
import People from './People';

const App = ({ clickerCount, children }) => {
  const [showClickers, setShowClickers] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    let sum = 0;
    for (let i = 0; i < clickerCount; i++)
      sum += parseInt(localStorage.getItem(`count${i}`));
    setTotalCount(sum);
  }, []);

  const increment = () => setTotalCount(totalCount + 1);
  const decrement = () => setTotalCount(totalCount - 1);

  const colors = useMemo(() => {
    const colors = [];
    for (let i = 0; i < clickerCount; i++)
      colors.push(`hsl(${Math.random() * 361}deg, 20%, 80%)`);
    return colors;
  }, [clickerCount]);

  return (
    <>
      {children}
      <div>Total Clicks: {totalCount}</div>
      <button
        onClick={() => {
          setShowClickers(!showClickers);
          setTotalCount(0);
        }}
      >
        {showClickers ? 'Hide' : 'Show'}
      </button>
      {showClickers &&
        [...Array(clickerCount)].map((v, i) => {
          return (
            <Clicker
              key={i}
              keyName={`count${i}`}
              color={colors[i]}
              increment={increment}
              decrement={decrement}
            />
          );
        })}
      <People />
    </>
  );
};

export default App;
