const User = require("../models/User.model");
const Ticket = require("../models/ticket.model");
const objectConvertor = require("../utils/objectConvertor");
const Constants = require("../utils/constants");
const constants = require("../utils/constants");
exports.createTicket = async (req, res) => {
  const ticketObj = {
    title: req.body.title,
    description: req.body.description,
    ticketPriority: req.body.ticketPriority,
    status: req.body.status,
    reporter: req.userId,
  };
  try {
    /**
     * logc to find Engineer and approved
     */
    const engineer = await User.findOne({
      userType: "ENGINEER",
      userStatus: "APPROVED",
    });

    ticketObj.assignee = engineer.userId;

    /**
     * update customer and engineer data
     */

    const ticket = await Ticket.create(ticketObj);
    if (ticket) {
      const user = await User.findOne({
        userId: req.userId,
      });
      user.ticketsCreated.push(ticket._id);
      await user.save();
      engineer.ticketsAssigned.push(ticket._id);
      await engineer.save();
    }
    res.status(200).send(objectConvertor.ticketResponse(ticket));
  } catch (err) {
    console.log("error while ticket creation ", err);
    res.status(500).send({
      message: "internal server error",
    });
  }
};

exports.updateTicket = async (req, res) => {
  const ticketId = req.params.id;
  const ticket = await Ticket.findOne({ _id: ticketId });
  if (!ticket) {
    return res.status(400).send({
      message: "ticket is not present ",
    });
  }
  const savedUser = await User.findOne({ userId: req.userId });
  if (
    ticket.reporter == req.userId ||
    ticket.assignee == req.userId ||
    savedUser.userType == Constants.userTypes.admin
  ) {
    ticket.title = req.body.title != undefined ? req.body.title : ticket.title;
    ticket.description =
      req.body.description != undefined
        ? req.body.description
        : ticket.description;
    ticket.ticektPriority =
      req.body.ticektPriority != undefined
        ? req.body.ticektPriority
        : ticket.ticektPriority;
    ticket.status =
      req.body.status != undefined ? req.body.status : ticket.status;
    ticket.assignee =
      req.body.assignee != undefined ? req.body.assignee : ticket.assignee;

    var updatedTicket = await ticket.save();
    res.status(200).send(objectConvertor.ticketResponse(updatedTicket));
  } else {
    res
      .status(401)
      .send("ticket can be only updated by customer or engineer or admin");
  }
};

exports.getAllTIckets = async (req, res) => {
  /**
   * admin should get all tikets can apply status filter
   * customer should only get tickets created by them
   */

  const queryObj = {};
  if (req.query.status != undefined) {
    queryObj.status = { $regex: new RegExp(req.query.status), $options: "i" };
  }
  const savedUser = await User.findOne({ userId: req.userId });

  if (savedUser.userType == constants.userTypes.engineer) {
    queryObj.assignee = req.userId;
  } else if (savedUser.userType == constants.userTypes.customer) {
    queryObj.reporter = req.userId;
  } else {
  }

  const tickets = await Ticket.find(queryObj);
  res.status(200).send(tickets);
};
