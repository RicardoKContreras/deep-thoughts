const express = require('express');
//* we need to update the back-end server's code to serve up the React front-end code in production
const path = require('path');
// import ApolloServer
const { ApolloServer } = require('apollo-server-express');

//import middleware for Authenticating me query
const {authMiddleware} = require('./utils/auth');

// import our typeDefs and resolvers schema data
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
// create a new Apollo server and pass in our schema data
//context needed to be defined before using it
//This ensures that every request performs an authentication check, and the updated request object will be passed to the resolvers as the context.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

const app = express();


app.use(express.urlencoded({ extended: false }));

app.use(express.json());

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
// integrate our Apollo server with the Express application as middleware
server.applyMiddleware({app});


// Serve up static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// app.get('*', (req, res) => {
//   res.status(404).sendFile(path.join(__dirname, './public/404.html'));
// });

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    // log where we can go to test our GQL API
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
})
};

// Call the async function to start the server
startApolloServer(typeDefs, resolvers);
