import React, { useState } from 'react';
//*import the mutation and necessary Hook
import { useMutation } from '@apollo/client';
import { ADD_THOUGHT } from '../../utils/mutation';
//*The useMutation Hook can include an update function that allows us to update the cache of any related queries. The query we'll need to update is QUERY_THOUGHTS
import { QUERY_THOUGHTS, QUERY_ME } from '../../utils/queries';
const ThoughtForm = () => {
    const [thoughtText, setText] = useState('');
const [characterCount, setCharacterCount] = useState(0);

//* declare an addThought() function and error variable
//*Remember, the addThought() function will run the actual mutation. The error variable will initially be undefined but can change depending on if the mutation failed.
//* const [addThought, { error }] = useMutation(ADD_THOUGHT);
//*In the update() function, addThought represents the new thought that was just created. Using the cache object, we can read what's currently saved in the QUERY_THOUGHTS cache and then update it with writeQuery() to include the new thought object.
const [addThought, { error }] = useMutation(ADD_THOUGHT, {
    update(cache, { data: { addThought } }) {
    //*  we'll first wrap the QUERY_THOUGHTS cache update in a try...catch statement to prevent the error from blocking the next step. That next step will be to update the thoughts array on the QUERY_ME cache
    
      // could potentially not exist yet, so wrap in a try/catch
      try {
        // update me array's cache
        const { me } = cache.readQuery({ query: QUERY_ME });
        cache.writeQuery({
          query: QUERY_ME,
          data: { me: { ...me, thoughts: [...me.thoughts, addThought] } },
        });
      } catch (e) {
        console.warn("First thought insertion by user!")
      }
      // read what's currently in the cache
      const { thoughts } = cache.readQuery({ query: QUERY_THOUGHTS });
  
      // prepend the newest thought to the front of the array
      cache.writeQuery({
        query: QUERY_THOUGHTS,
        data: { thoughts: [addThought, ...thoughts] }
      });
    }
  });

const handleChange = event => {
    if (event.target.value.length <= 280) {
      setText(event.target.value);
      setCharacterCount(event.target.value.length);
    }
  };

  //*This function will eventually call a mutation, so we'll define it as an async function ahead of time.
  const handleFormSubmit = async event => {
    event.preventDefault();
//*Next, update the handleFormSubmit() function to use the addThought() mutation
     try {
    // add thought to database
    await addThought({
      variables: { thoughtText }
    });

    setText('');
    setCharacterCount(0);
} catch (e) {
    console.error(e);
  }
  };

  return (
    <div>
    {/* update the <p> element in the JSX to conditionally render an error message */}
    <p className={`m-0 ${characterCount === 280 || error ? 'text-error' : ''}`}>
        Character Count: {characterCount}/280
        {error && <span className="ml-2">Something went wrong...</span>}
    </p>
      {/* <p className="m-0">
        Character Count: 0/280
      </p> */}
      <form className="flex-row justify-center justify-space-between-md align-stretch"
    //   we need to capture when the user submits the form
        onSubmit={handleFormSubmit}
      >
        <textarea
           placeholder="Here's a new thought..."
        //    In the component's JSX, update the <textarea> element 
          value={thoughtText}
          className="form-input col-12 col-md-9"
          onChange={handleChange}
        ></textarea>
        <button className="btn col-12 col-md-3" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ThoughtForm;