import { data } from 'autoprefixer';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

function First() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.example.com/data');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means the effect runs only once after initial render

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return null;
   

  return (
    <div>
       <h1>Data from API:</h1>
       <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default First