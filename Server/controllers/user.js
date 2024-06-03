const { User } = require("../models");
const { SignInToken } = require("../utils/auth");

module.exports = {
  // get single user
  async getSingleUser({ user = null, params }, res) {
    const singleUser = await User.findOne([
      $or[({ id: user ? user._id : params.id }, { username: params.username })],
    ]);
    if (!singleUser) {
      return res.status(400).json({ messae: "cannot find user" });
    }
    res.json(singleUser);
  },

  //create user
  async createUser({ body }, res) {
    const newUser = await User.create(body);

    if (!newUser) {
      return res.status(400).json({ message: "failed to make user" });
    }

    const token = SignInToken(singleUser);
    res.json({ token, singleUser });
  },

  //login user
  async login({ body }, res) {
    const user = await User.findOne({
      $or: [{ username: body.username }, { email: body.email }],
    });

    if (!user) {
      return res.status(400).json({ message: "cannot login" });
    }

    const correctPw = await user.isCorrectPassword(body.password);

    if (!correctPw) {
      return res.status(400).json({ message: "password or email incorrect" });
    }
    const token = SignInToken(singleUser);
    res.json({ token, singleUser });
  },
  //save book
  async saveBook({ user, body }, res) {
    console.log(user);
    try {
      const newBook = await User.findOneAndUpdate(
        { _id: user._id },
        { $addToSet: { savedBooks: body } },
        { new: true, runValidators: true }
      );
      return res.json(newBook);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  },
  //remove book

  async deleteBook({ user, params }, res) {
    const newBook = await User.findOneAndUpdate(
      { _id: user._id },
      { $pull: { savedBooks: { bookId: params.bookId } } },
      { new: true }
    );

    if (!newBook) {
      return res.status(400).json({ messae: "cannot find book" });
    }
    return res.json(newBook);
  },
};
