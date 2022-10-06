import React from 'react';
import { Link } from 'react-router-dom';
//*import Auth for token from utils/auth
import Auth from '../../utils/auth';

const Header = () => {
//*With the event.preventDefault(), we're actually overriding the <a> element's default nature of having the browser load a different resource. Instead, we execute the .logout() method, which will remove the token from localStorage and then refresh the application by taking the user back to the homepage.
  const logout = event => {
    event.preventDefault();
    Auth.logout();
  };

  return (
    <header className="bg-secondary mb-4 py-2 flex-row align-center">
      <div className="container flex-row justify-space-between-lg justify-center align-center">
        {/*added Link to connect with a navigation link click */}
      <Link to="/">
        <h1>Deep Thoughts</h1>
        </Link>

        <nav className="text-center">

          {/* <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link> */}
          {/* Whenever a page renders the <Header> component, which should be on every single page because it's rendered by the <App> component, we check to see if the user is logged in and return navigation items depending on the result. This is just another good case of using ternary operators to conditionally render React data based on the status of a specific function or data. */}
          {Auth.loggedIn() ? (
        <>
          <Link to="/profile">Me</Link>
          <a href="/"onClick={logout}>
           Logout
           </a>
           </>
         ) : (
         <>
      <Link to="/login">Login</Link>
      <Link to="/signup">Signup</Link>
      </>
  )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
