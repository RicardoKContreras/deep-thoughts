//import the gql tagged template function
const {gql} = require('apollo-server-express');

//create our typeDefs
//With this, we've now defined our thoughts query that it could receive a parameter if we wanted. In this case, the parameter would be identified as username and would have a String data type.
//Keep in mind that the way we set this up will allow us to query thoughts with or without the username parameter. If we needed to enforce a parameter for our query, we'd have to add something else to it—we'll get to that in a bit.
//query {
   // # find a username from your previous query's results and paste it in for `<username-goes-here>` (i.e. "Wilton18")
    //thoughts(username: "<username-goes-here>") {
     // username
     // thoughtText
   // }
 // }
const typeDefs = gql`
type Thought {
    _id: ID
    thoughtText: String
    createdAt: String
    username: String
    reactionCount: Int
    reactions: [Reaction]
}

type Reaction {
    _id: ID
    reactionBody: String
    createdAt: String
    username: String
}

type User {
    _id: ID
    username: String
    email: String
    friendCount: Int
    thoughts: [Thought]
    friends: [User]
}

type Auth {
    token: ID!
    user: User
}

    type Query {
        me : User
        users: [User]
        user(username:String!): User
        thoughts(username: String): [Thought]
        thought(_id: ID!): Thought
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        addThought(thoughtText: String!): Thought
        addReaction(thoughtId: ID!, reactionBody: String!): Thought
        addFriend(friendId: ID!): User
    }
    `;

//export the typeDefs
module.exports = typeDefs;