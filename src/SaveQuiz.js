import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { useHistory } from 'react-router-dom';

import client from './client';

function SaveQuiz({ open = false, onClose, quizItems }) {
  return (
    open && (
      <div className="save-quiz__overlay">
        <div className="save-quiz__form">
          <i
            onClick={() => onClose(false)}
            className="far fa-times-circle save-quiz__close"
          ></i>
          <FormAuth quizItems={quizItems} />
        </div>
      </div>
    )
  );
}

const FormAuth = withAuthenticator(Form);

function Form({ quizItems }) {
  const [state, setState] = useState({ name: '', saving: false });
  const history = useHistory();

  const handleNameChange = (e) => setState({ ...state, name: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentUser = await Auth.currentAuthenticatedUser();

    if (!state.name) {
      return;
    }

    setState({ ...state, saving: true });
    try {
      await client.saveQuiz({
        name: state.name,
        owner: currentUser.username,
        items: quizItems,
      });
      history.push('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Give your quiz a name:</label>
      <input
        id="name"
        required
        value={state.name}
        onChange={handleNameChange}
      />
      {
        <button type="submit" className="btn">
          {state.saving ? 'Saving...' : 'Save'}
        </button>
      }
    </form>
  );
}

export default SaveQuiz;
