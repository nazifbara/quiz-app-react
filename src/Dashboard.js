import React from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';

function Dashboard() {
  return <h3>Your saved quizzes</h3>;
}

export default withAuthenticator(Dashboard);
