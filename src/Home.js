import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

import client from './client';

function Home() {
  const [categories, setCategories] = useState({
    items: [],
    isLoading: true,
    error: null,
  });
  const [criteria, setCriteria] = useState({
    amount: 8,
    category: '',
    difficulty: '',
  });
  const [queryString, setQueryString] = useState('');

  const fetchCategories = useCallback(async () => {
    try {
      const result = await client.getCategories();
      setCategories({ items: result, isLoading: false });
    } catch (error) {
      setCategories((c) => ({ ...c, error }));
    }
  }, [setCategories]);

  const handleCriteriaChange = (type, value) =>
    setCriteria({ ...criteria, [type]: value });

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    // compose the query string base on the criteria
    const queryS = Object.entries(criteria)
      .filter((entry) => entry[1] !== '')
      .map((entry) => entry.join('='))
      .join('&');
    setQueryString(queryS);
  }, [criteria]);

  if (categories.error) {
    throw categories.error;
  }

  if (categories.isLoading) {
    return <span>Loading...</span>;
  }

  return (
    <div>
      <h3 className="text-align-c">Get ready for the quiz!</h3>
      <label htmlFor="amount">Number of Questions:</label>
      <input
        id="amount"
        value={criteria.amount}
        onChange={(e) => handleCriteriaChange('amount', e.target.value)}
        type="number"
        min="8"
        max="50"
      />
      <label htmlFor="category">Select Category:</label>
      <select
        id="category"
        value={criteria.category}
        onChange={(e) => handleCriteriaChange('category', e.target.value)}
      >
        <option value="">Any Category</option>
        {categories.items.map((c) => (
          <option key={c.id + c.name} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <label htmlFor="difficulty">Select Difficulty:</label>
      <select
        id="difficulty"
        value={criteria.difficulty}
        onChange={(e) => handleCriteriaChange('difficulty', e.target.value)}
      >
        <option value="">Any Difficulty</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
      <div className="text-align-c">
        <Link to={'/quiz?' + queryString} className="btn">
          Start the quiz!
        </Link>
      </div>
    </div>
  );
}

export default Home;
