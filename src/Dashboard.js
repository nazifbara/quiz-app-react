import React, { useEffect, useState } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';

import client from './client';

function Dashboard() {
  const [quizzes, setQuizzes] = useState([]);
  useEffect(() => {
    client.fetchSavedQuizzes().then(setQuizzes);
  }, []);
  return (
    <div>
      <h3>Your saved quizzes</h3>
      {quizzes.map((q) => (
        <div key={q.id}>{q.name}</div>
      ))}
    </div>
  );
}

export default withAuthenticator(Dashboard);
