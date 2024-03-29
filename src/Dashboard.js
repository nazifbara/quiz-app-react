import React, { useEffect, useState } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { Link } from 'react-router-dom';

import client from './client';

function Dashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    client.getSavedQuizzes().then(setQuizzes).catch(setError);
  }, []);

  if (error) {
    throw error;
  }

  return (
    <div>
      <h3>Your saved quizzes</h3>
      <ul>
        {quizzes.map((q) => (
          <li key={q.id}>
            <Link to={`/quiz/${q.id}`}>{q.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default withAuthenticator(Dashboard);
