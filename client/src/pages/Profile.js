import React from 'react';
//*import the necessary components for a users profile
//*This component, Redirect, will allow us to redirect the user to another route within the application. Think of it like how we've used location.replace() in the past, but it leverages React Router's ability to not reload the browser!
import {  Navigate, useParams } from 'react-router-dom';
import FriendList from '../components/FriendList';
import Auth from '../utils/auth';
import ThoughtList from '../components/ThoughtList';
import { useQuery } from '@apollo/client';
import { QUERY_USER, QUERY_ME } from '../utils/queries';

//*Again, this is very similar to the logic in SingleThought.js. The useParams Hook retrieves the username from the URL, which is then passed to the useQuery Hook. 
//*The user object that is created afterwards is used to populate the JSX. This includes passing props to the ThoughtList component to render a list of thoughts unique to this user.
const Profile = () => {
  const { username: userParam } = useParams();

  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam }
  });

  const user = data?.me || data?.user || {};

// navigate to personal profile page if username is the logged-in user's
//*add functionality to the Profile component definition to check if the logged-in user's username is the same as the parameter, and redirect if so.
//*if the username stored in the JSON Web Token is the same as the userParam value. If they match, we return the <Navigate> component with the prop to set to the value /profile, which will redirect the user away from this URL and to the /profile route.
//*The Navigate component is extremely useful, so make sure you take a moment or two to learn it—and keep it in mind as you build future applications!
if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
  return <Navigate to="/profile" />;
}

  if (loading) {
    return <div>Loading...</div>;
  }

//*Now if there is no user data to display, we know that we aren't logged in or at another user's profile page. Instead of redirecting the user away, we simply inform them that they need to be logged in to see this page and they must log in or sign up to use it.
  if (!user?.username) {
    return (
      <h4>
        You need to be logged in to see this page. Use the navigation links above to sign up or log in!
      </h4>
    );
  }

  return (
    <div>
      <div className="flex-row mb-3">
        <h2 className="bg-dark text-secondary p-3 display-inline-block">
          {/* Viewing <usernames>'s profile. */}
          {/* Now if userParam doesn't exist, we'll get a message saying "Viewing your profile." Otherwise, it will display the username of the other user on their profile. */}
          Viewing {userParam ? `${user.username}'s` : 'your'} profile.
          {/* {user.username}'s */}
        </h2>
      </div>

      <div className="flex-row justify-space-between mb-3">
        <div className="col-12 mb-3 col-lg-8">{/* PRINT THOUGHT LIST  */}
        <ThoughtList thoughts={user.thoughts} title={`${user.username}'s thoughts...`} />
        </div>

        <div className="col-12 col-lg-3 mb-3">
        <FriendList
           username={user.username}
          friendCount={user.friendCount}
          friends={user.friends}
           />
          {/* PRINT FRIEND LIST */}
          </div>
      </div>
    </div>
  );
};

export default Profile;
