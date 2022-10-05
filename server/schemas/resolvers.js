const {User, Thought} = require('../models');
const {AuthenticationError} = require('apollo-server-express');
const {signToken} = require('../utils/auth');

const resolvers = {
    Query: {

        me: async(parent, args, context) => {
            if(context.user){
            const userData = await User.findOne({_id: context.user._id})
            .select('-__v -password')
            .populate('thoughts')
            .populate('friends');

            return userData;
        }
            throw new AuthenticationError('Not logged in!!');
        },

        //Here, we pass in the parent as more of a placeholder parameter. It won't be used, but we need something in that first parameter's spot so we can access the username argument from the second parameter. We use a ternary operator to check if username exists. If it does, we set params to an object with a username key set to that value. If it doesn't, we simply return an empty object.
        thoughts: async (parent, {username}) => {
            const params = username ? {username} : {};
            return Thought.find(params).sort({createdAt: -1});
        },

        thought: async (parent, {_id}) => {
            return Thought.findOne({_id});
        },
        //get all users
        users: async () => {
            return User.find()
            .select('-__v -password')
            .populate('friends')
            .populate('thoughts');
        },
        //get a user by username
        user: async (parent, {username}) => {
            return User.findOne({username})
            .select('-__v -password')
            .populate('friends')
            .populate('thoughts');
        }
    },

    Mutation: {


        addThought: async (parent, args, context) => {
            if (context.user) {
              const thought = await Thought.create({ ...args, username: context.user.username });
          
              await User.findByIdAndUpdate(
                { _id: context.user._id },
                { $push: { thoughts: thought._id } },
                { new: true }
              );
          
              return thought;
            }
          
            throw new AuthenticationError('You need to be logged in!');
          },



          addReaction: async (parent, { thoughtId, reactionBody }, context) => {
            if (context.user) {
              const updatedThought = await Thought.findOneAndUpdate(
                { _id: thoughtId },
                { $push: { reactions: { reactionBody, username: context.user.username } } },
                { new: true, runValidators: true }
              );
          
              return updatedThought;
            }
          
            throw new AuthenticationError('You need to be logged in!');
          },
          //* A user can't be friends with the same person twice, though, hence why we're using the $addToSet operator instead of $push to prevent duplicate entries.
          addFriend: async (parent, { friendId }, context) => {
            if (context.user) {
              const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $addToSet: { friends: friendId } },
                { new: true }
              ).populate('friends');
          
              return updatedUser;
            }
          
            throw new AuthenticationError('You need to be logged in!');
          },


        //Have a signed token with users data
        //CREATE a user with args(object of the values passed into a query/mutation request as parameters)
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return {token, user};
        },

        //Authenticate login by checking to see if email and password are correct
        login: async (parent, {email, password}) => {
            const user = await User.findOne({email});

            if(!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if(!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }
            
            const token = signToken(user);
            return {token, user};

        }
    }
};

module.exports = resolvers;