import { useEffect, useState } from 'react';

const People = () => {
  const [people, setPeople] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getPeople();
  }, []);

  const getPeople = async () => {
    setIsLoading(true);
    try {
      const request = await fetch('https://jsonplaceholder.typicode.com/users');
      const data = await request.json();
      setPeople(data);
    } catch (e) {
      setPeople([
        { id: 0, name: 'Loading error. Check your connection and try again.' },
      ]);
    }
    setIsLoading(false);
  };

  return (
    <>
      <h1>People</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {people.map((person) => {
            return <li key={person.id}>{person.name}</li>;
          })}
        </ul>
      )}
    </>
  );
};

export default People;
