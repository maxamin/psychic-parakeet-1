// http://localhost:3000/redirect?url=http://localhost:3000/
module.exports = (req, res) => {
  const userURL = req.query.url;
  res.redirect(userURL);
};
