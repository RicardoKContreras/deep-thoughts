import React, { useState } from 'react';
//* Implementing this form will look very similar to the steps we took with the Add Thought form
//* Note that this component expects to be given a prop called thoughtId. This ID will be necessary when it comes time to call the mutation.
import { useMutation } from '@apollo/client';
import { ADD_REACTION } from '../../utils/mutation';

const ReactionForm = ({ thoughtId }) => {

//*Next, add state to the form. Add the following state variables and handler functions to the ReactionForm
const [reactionBody, setBody] = useState('');
const [characterCount, setCharacterCount] = useState(0);
const [addReaction, { error }] = useMutation(ADD_REACTION);

const handleChange = event => {
  if (event.target.value.length <= 280) {
    setBody(event.target.value);
    setCharacterCount(event.target.value.length);
  }
};

const handleFormSubmit = async event => {
    try {
        await addReaction({
          variables: { reactionBody, thoughtId },
        });
  
        // clear form value
        setBody('');
        setCharacterCount(0);
      } catch (e) {
        console.error(e);
      }
};


  return (
    <div>
      <p
        className={`m-0 ${characterCount === 280 || error ? 'text-error' : ''}`}
      >
        Character Count: {characterCount}/280
        {error && <span className="ml-2">Something went wrong...</span>}
      </p>
      <form
        className="flex-row justify-center justify-space-between-md align-stretch"
        onSubmit={handleFormSubmit}
      >
        <textarea
          placeholder="Leave a reaction to this thought..."
          value={reactionBody}
          className="form-input col-12 col-md-9"
          onChange={handleChange}
        ></textarea>

        <button className="btn col-12 col-md-3" type="submit">
          Submit
        </button>
      </form>

      {error && <div>Something went wrong...</div>}
    </div>
  );
};

export default ReactionForm;