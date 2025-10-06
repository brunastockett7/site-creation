/* eslint-env node */
const jwt = require("jsonwebtoken");

/**
 * Reads JWT from cookie, verifies it, and exposes user to EJS via res.locals.user.
 * Does NOT block guests—use authRequired for protected routes.
 */
function attachUser(req, res, next) {
  // initialize explicitly so downstream logic is predictable
  req.user = null;
  res.locals.user = null;

  const token = req.cookies?.jwt;
  if (!token) return next();

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;        // { id, email, role, name, iat, exp }
    res.locals.user = payload; // available to views/partials
  } catch (_err) {
    // bad/expired token → clear it so header shows logged-out links
    res.clearCookie("jwt", { httpOnly: true, sameSite: "lax" });
  }
  next();
}

/** Protects routes: requires a valid user */
function authRequired(req, res, next) {
  if (!req.user) {
    // flash message optional
    if (req.session) req.session.flash = "Please log in to continue.";
    return res.redirect("/auth/login"); // <-- fix: correct prefix
  }
  next();
}

/** Optional: restrict by role(s) */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      if (req.session) req.session.flash = "Please log in to continue.";
      return res.redirect("/auth/login"); // <-- fix: correct prefix
    }
    if (!roles.includes(req.user.role)) return res.status(403).send("Forbidden");
    next();
  };
}

/**
 * Logout function: destroys session and clears JWT cookie.
 */
function logout(req, res) {
  // Destroy session
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error logging out:", err);
        return res.status(500).send("Error logging out");
      }

      // Clear the JWT cookie
      res.clearCookie("jwt", { httpOnly: true, sameSite: "lax" });

      // Redirect to the logout success page or homepage
      return res.redirect("/logout-success");
    });
  } else {
    // If no session, clear the cookie and redirect
    res.clearCookie("jwt", { httpOnly: true, sameSite: "lax" });
    return res.redirect("/logout-success");
  }
}

module.exports = { attachUser, authRequired, requireRole };
