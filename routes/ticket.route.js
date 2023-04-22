const ticketController = require("../controllers/ticket.controller");
const authMiddleware = require("../middleware/auth");
const commentController = require("../controllers/comment.controller");
const verifyReqMid = require("../middleware/verifyTicketRequest");
module.exports = function (app) {
  app.post(
    "/crm/api/v1/ticket",
    [authMiddleware.verifyToken, verifyReqMid.validateTicketReq],
    ticketController.createTicket
  );
  app.put(
    "/crm/api/v1/ticket/:id",
    [authMiddleware.verifyToken, verifyReqMid.validateTicketReq],
    ticketController.updateTicket
  );
  app.get(
    "/crm/api/v1/tickets",
    [authMiddleware.verifyToken],
    ticketController.getAllTIckets
  );
  app.post(
    "/crm/api/v1/tickets/:ticketId/comments",
    [authMiddleware.verifyToken],
    commentController.createComment
  );
  app.get(
    "/crm/api/v1/tickets/:ticketId/comments",
    [authMiddleware.verifyToken],
    commentController.fetchComment
  );
};
