const jwt = require("jsonwebtoken");
function auth(req, res, next) {
  var token = req.header("authorization");
  if (!token) {
    return res.status(401).json({ message: "not token, authorrizaton denied" });
  }
  try {
    const decoded = jwt.verify(token, "agsjhdgashjdgahjsd");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "token is not valid" });
  }
}
module.exports = auth;
