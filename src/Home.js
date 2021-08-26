import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
      <Link to="/quiz" className="btn">
        Start the quiz!
      </Link>
    </>
  );
}

export default Home;
