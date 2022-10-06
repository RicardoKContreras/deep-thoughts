import React from 'react';
//* copy import apollprovider and dependencies
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
//* importfunction from Apollo Client that will retrieve the token from localStorage and include it with each request to the API
//*With this function, setContext, we can create essentially a middleware function that will retrieve the token for us and combine it with the existing httpLink
import { setContext } from '@apollo/client/link/context';
import Header from './components/Header';
import Footer from './components/Footer';
//* Copy for importing BrowserRouter, Routes, and Route are components that the React Router library provides. We renamed BrowserRouter to Router to make it easier to work with
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//* Import the other page components
import Login from './pages/Login';
import NoMatch from './pages/NoMatch';
import SingleThought from './pages/SingleThought';
import Profile from './pages/Profile';
import Signup from './pages/Signup';
import Home from './pages/Home';

const httpLink = createHttpLink({
  uri: '/graphql',
});

//*With the configuration of authLink, we use the setContext() function to retrieve the token from localStorage and set the HTTP request headers of every request to include the token, whether the request needs it or not. This is fine, because if the request doesn't need the token, our server-side resolver function won't check for it.
//*Because we're not using the first parameter, but we still need to access the second one, we can use an underscore _ to serve as a placeholder for the first parameter
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  //*we need to combine the authLink and httpLink objects so that every request retrieves the token and sets the request headers before making the request to the API.
  link: authLink.concat(httpLink),
  //*httpLink,
  cache: new InMemoryCache(),
});

function App() {
  //* Updated this to have the imported page components
  //*We've wrapped the <div className="flex-column"> element in a Router component, which makes all of the child components on the page aware of the client-side routing that can take place now.
  //*In the <div className="container"> element, we place a singular Routes component that will hold several Route components that signify this part of the app as the place where content will change according to the URL route
  //*When the route is /, the Home component will render here. When the route is /login, the Login component will render.
  //*A good way to think about this is that the Router component will always contain within it the Routes component. And the Routes component will contain within it the Route component.
  //*The two nested <Route> components for our /profile path will allow us to use optional parameters, so /profile and /profile/myUsername will both render the Profile component. Note the order: we'll check for a /:username parameter first; if none is provided in the URL path, we'll render the <Profile> component without one. Later on, we'll set up /profile to display the logged-in user's information.
  return (
    <ApolloProvider client={client}>
    <Router>
      <div className="flex-column justify-flex-start min-100-vh">
        <Header />
        <div className="container">
          <Routes>
            <Route
              path="/"
              element={<Home />}
            />
            <Route
              path="/login"
              element={<Login />}
            />
            <Route
              path="/signup"
              element={<Signup />}
            />
              <Route path="/profile">
            <Route path=":username" element={<Profile />} />
            <Route path="" element={<Profile />} />
            </Route>
            
            <Route
              path="/thought/:id"
              element={<SingleThought />}
            />
             <Route
              path="*"
              element={<NoMatch />}
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  </ApolloProvider>
  );
}

export default App;
