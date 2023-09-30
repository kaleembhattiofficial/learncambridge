////////////////////
// Global
////////////////////

////////////////////
// Components
////////////////////

////////////////////
// Body
////////////////////

module.exports.username = {
  isLocal: true,
  message: "Provide a valid username",
  more: [
    "Username: More than 4 characters",
    "Username: Less than 64 characters",
  ],
  statusCode: 400,
};

module.exports.password = {
  isLocal: true,
  message: "Provide a valid password",
  more: [
    "Password: More than 8 characters",
    "Password: Less than 64 characters",
  ],
  statusCode: 400,
};

module.exports.usernameAndPassword = {
  isLocal: true,
  message: "Provide a valid username and password",
  more: [
    "Username: More than 4 characters",
    "Username: Less than 64 characters",
    "Password: More than 8 characters",
    "Password: Less than 64 characters",
  ],
  statusCode: 400,
};

module.exports.noUserFound = {
  isLocal: true,
  message: "No user found with your credentials",
  more: [
    "User account may have been deleted",
    "User may never have existed at all",
  ],
  statusCode: 400,
};

module.exports.noToken = {
  isLocal: true,
  message: "Please provide a token",
  more: ["Could be either an access or refresh token"],
  statusCode: 401,
};

module.exports.noId = {
  isLocal: true,
  message: "The ID does not exist",
  more: [
    "The ID which you provided might be wrong",
    "The document may have been removed or relocated",
  ],
  statusCode: 401,
};

module.exports.noPermissions = {
  isLocal: true,
  message: 'You dont have the authority to perform this action',
  more: ['The document may have been removed or relocated'],
  statusCode: 403,
};

module.exports.noChangesMade = {
  isLocal: true,
  message: "Can't edit the document as you havn't made any changes",
  more: ["You edited document and the original document are exactly the same"],
  statusCode: 200,
};


module.exports.noSubject = {
  isLocal: true,
  message: 'The Subject which you tried to make changes to does no longer exists',
  more: ['It may have been deleted or never have existed at all'],
  statusCode: 200,
};

module.exports.topicRepetition = {
  isLocal: true,
  message: 'The topic which you want to create already exists. Try editing it first',
  more: [],
  statusCode: 200,
};
