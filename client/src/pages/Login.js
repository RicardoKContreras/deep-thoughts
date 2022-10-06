import React, { useState } from 'react';
//* import apollo and login mutation from utils/mutation
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutation';
//* import Auth from utils/auth
import Auth from '../utils/auth';

const Login = (props) => {
  const [formState, setFormState] = useState({ email: '', password: '' });

//*initialize our LOGIN_USER mutation with the useMutation() Hook
  const [login, { error }] = useMutation(LOGIN_USER);

  // update state based on form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // submit form
  const handleFormSubmit = async (event) => {
    event.preventDefault();
//*We'll also want to update the handleFormSubmit() function to work the same way we did with the Signup component
//*the ... in this context is being used as the spread operator. This means that we are setting the variables field in our mutation to be an object with key/value pairs that match directly to what our formState object looks like.
    try {
      const { data } = await login({
        variables: { ...formState }
      });
  
      console.log(data);
      Auth.login(data.login.token);
    } catch (e) {
      console.error(e);
    }

    // clear form values
    setFormState({
      email: '',
      password: '',
    });
  };

  return (
    <main className='flex-row justify-center mb-4'>
      <div className='col-12 col-md-6'>
        <div className='card'>
          <h4 className='card-header'>Login</h4>
          <div className='card-body'>
            <form onSubmit={handleFormSubmit}>
              <input
                className='form-input'
                placeholder='Your email'
                name='email'
                type='email'
                id='email'
                value={formState.email}
                onChange={handleChange}
              />
              <input
                className='form-input'
                placeholder='******'
                name='password'
                type='password'
                id='password'
                value={formState.password}
                onChange={handleChange}
              />
              <button className='btn d-block w-100' type='submit'>
                Submit
              </button>
              {error && <div>Login failed</div>}
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
