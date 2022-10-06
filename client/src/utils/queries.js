import { gql } from '@apollo/client';
//* All of the information displayed on this page is already available through the thought() query that you set up earlier using GraphQL. Now you just need to use this query in the front end of your app.
export const QUERY_THOUGHTS = gql`
  query thoughts($username: String) {
    thoughts(username: $username) {
      _id
      thoughtText
      createdAt
      username
      reactionCount
      reactions {
        _id
        createdAt
        username
        reactionBody
      }
    }
  }
`;

export const QUERY_THOUGHT = gql`
  query thought($id: ID!) {
    thought(_id: $id) {
      _id
      thoughtText
      createdAt
      username
      reactionCount
      reactions {
        _id
        createdAt
        username
        reactionBody
      }
    }
  }
`;

//*The data on this page is a combination of the user's information, thoughts, and friends. Fortunately, you've already written a user() query in GraphQL that consolidates these data points.
export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
      friendCount
      friends {
        _id
        username
      }
      thoughts {
        _id
        thoughtText
        createdAt
        reactionCount
      }
    }
  }
`;

//*Did you notice that this query doesn't have the same syntax as the other queries? Because we aren't passing any variables to it, we can simply name the query, and GraphQL will handle the rest.
//*With this query, we're going to retrieve essentially all data related to the logged-in user

export const QUERY_ME = gql`
  {
    me {
      _id
      username
      email
      friendCount
      thoughts {
        _id
        thoughtText
        createdAt
        reactionCount
        reactions {
          _id
          createdAt
          reactionBody
          username
        }
      }
      friends {
        _id
        username
      }
    }
  }
`;

//*With this query, we're requesting significantly less data to be returned over HTTP. If we were to do this with a RESTful API, we'd have to create another route to query a user and return less information. With GraphQL, we can reuse the same query we created and simply ask for less.
export const QUERY_ME_BASIC = gql`
  {
    me {
      _id
      username
      email
      friendCount
      friends {
        _id
        username
      }
    }
  }
`;
