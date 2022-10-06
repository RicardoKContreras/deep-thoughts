import React from 'react';
//* copy import apollprovider and dependencies
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
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

const client = new ApolloClient({
  link: httpLink,
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
