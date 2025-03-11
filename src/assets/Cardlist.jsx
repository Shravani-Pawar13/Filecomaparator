import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from 'react-bootstrap/Button';


function Cardlist() {
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("/data1.json")
      .then(response => {
        setCards(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setError("Failed to load data");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">Card List</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map(card => (
          <div key={card.id} className="p-4 border-1 rounded shadow-md">
            <h3 className="font-semibold">{card.title}</h3>
            <p>{card.summary}</p>
            <button 
              className="bg-blue-500 text-white px-4 py-2 mt-2"
              onClick={() => setSelectedCard(card)}
            >
              Info
            </button>
          </div>
        ))}
      </div>
      {selectedCard && (
        <div className="mt-4 p-4 border rounded bg-gray-200">
          <h3 className="font-semibold">{selectedCard.title}</h3>
          <p>{selectedCard.details}</p>
          <button className="mt-2 bg-red-500 text-white px-4 py-2" onClick={() => setSelectedCard(null)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default Cardlist;