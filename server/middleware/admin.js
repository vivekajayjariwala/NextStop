function admin(req, res, next) {
    // 401 Unauthorized if user isn't logged in
    if (!req.user) return res.status(401).send('Access denied. No token provided.');
    
    // 403 Forbidden if user isn't an admin
    if (!req.user.isAdmin) return res.status(403).send('Access denied. Admin rights required.');
    
    next();
}

module.exports = admin; 