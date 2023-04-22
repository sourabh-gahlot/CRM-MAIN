const Comment = require("../models/comment.model");
exports.createComment = async (req, res) => {
  const commentReqObj = {
    content: req.body.content,
    ticketId: req.params.ticketId,
    commenterId: req.userId,
  };
  try {
    const comment = await Comment.create(commentReqObj);
    res.status(200).send(comment);
  } catch (err) {
    console.log("commenter error", err);
    res.status(500).send({
      message: "internal server error",
    });
  }
};
exports.fetchComment = async (req, res) => {
  try {
    const comment = await Comment.find({ ticketId: req.params.ticketId });
    res.status(200).send(comment);
  } catch (err) {
    console.log("commenter error", err);
    res.status(500).send({
      message: "internal server error",
    });
  }
};
