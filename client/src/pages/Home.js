import React from 'react';
//* coping here for apollo hooks to use from apollo client
//* We also imported the QUERY_THOUGHTS from utils/queries
//*This will allow us to make requests to the GraphQL server we connected to and made available to the application using the <ApolloProvider> component in App.js earlier.
import { useQuery } from '@apollo/client';
import { QUERY_THOUGHTS, QUERY_ME_BASIC} from '../utils/queries';
//*import Auth to check logged in status
import Auth from '../utils/auth';
import ThoughtList from '../components/ThoughtList';
import FriendList from '../components/FriendList';
//*importing thought form

import ThoughtForm from '../components/ThoughtForm';

const Home = () => {
   // use useQuery hook to make query request
   const { loading, data } = useQuery(QUERY_THOUGHTS);
   const thoughts = data?.thoughts || [];
console.log(thoughts);
// use object destructuring to extract `data` from the `useQuery` Hook's response and rename it `userData` to be more descriptive
const { data: userData } = useQuery(QUERY_ME_BASIC);
const loggedIn = Auth.loggedIn();
  return (
    <main>
      <div className='flex-row justify-space-between'>
      {loggedIn && (
      <div className="col-12 mb-3">
        <ThoughtForm />
      </div>
    )}
      {/* With this in place, we're conditionally defining the layout for this <div>. If the user isn't logged in, it'll span the full width of the row. But if you the user is logged in, it'll only span eight columns, leaving space for a four-column <div> on the righthand side. */}
        <div className={`col-12 mb-3 ${loggedIn && 'col-lg-8'}`}>
          {loading ? (
        <div>Loading...</div>
      ) : (
        <ThoughtList thoughts={thoughts} title="Some Feed for Thought(s)..." />
      )/* PRINT THOUGHT LIST */}</div>
      {loggedIn && userData ? (
      <div className="col-12 col-lg-3 mb-3">
    <FriendList
      username={userData.me.username}
      friendCount={userData.me.friendCount}
      friends={userData.me.friends}
    />
    </div>
      ) : null}
      </div>
    </main>
  );
};

export default Home;
