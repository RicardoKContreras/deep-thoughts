import { gql } from '@apollo/client';
//* Import the mutations from backend
//*Again, we import the gql tagged template literal functionality to create a GraphQL mutation called login. This will accept two variables, $email and $password, whose values we'll set up to be passed in as arguments when we integrate this with the login form page.
//*Let's now get these mutations up and running with their respective form pages. It's going to use a different type of Hook from Apollo's react-hooks library. We used useQuery() for queries;
export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

//*Next, we need to create the mutation for creating a new user through the signup form page
//*This mutation is essentially the same as the LOGIN_USER one we created earlier, with the exception that we are now asking for an email address as well.
export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;
//* Adding a friend mutation
export const ADD_FRIEND = gql`
  mutation addFriend($id: ID!) {
    addFriend(friendId: $id) {
      _id
      username
      friendCount
      friends {
        _id
        username
      }
    }
  }
`;

export const ADD_THOUGHT = gql`
  mutation addThought($thoughtText: String!) {
    addThought(thoughtText: $thoughtText) {
      _id
      thoughtText
      createdAt
      username
      reactionCount
      reactions {
        _id
      }
    }
  }
`;

export const ADD_REACTION = gql`
  mutation addReaction($thoughtId: ID!, $reactionBody: String!) {
    addReaction(thoughtId: $thoughtId, reactionBody: $reactionBody) {
      _id
      reactionCount
      reactions {
        _id
        reactionBody
        createdAt
        username
      }
    }
  }
`;

