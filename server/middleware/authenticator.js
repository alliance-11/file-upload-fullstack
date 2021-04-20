// AUTH MIDDLEWARE => SECURITY AGENT
exports.auth = (req, res, next) => {

  let token = req.cookies.token

  if(!token) { return next({ message: "Token not provided", status: 401}) }

  // verify the token and store the user information inside in the request for later usage
  try {
    let userDecoded = jwt.verify(token, JWT_SECRET)
    req.user = userDecoded
    next()
  }
  catch(err) { next(err) }
}
