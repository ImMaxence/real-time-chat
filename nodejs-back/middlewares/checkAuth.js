const passport = require('passport');

module.exports = (roleNumber) => (req, res, next) => {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: '❌ - No token provided' });
    }

    req.headers.authorization = `Bearer ${token}`;

    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (err) {
            return res.status(500).json({ message: '❌ - Authentication error : ', error: err });
        }
        if (!user) {
            return res.status(403).json({ message: '❌ - Failed to authenticate token' });
        }
        if (user.role < roleNumber) {
            return res.status(403).json({ message: '❌ - Access denied' });
        }
        req.user = user;
        next();
    })(req, res);

}