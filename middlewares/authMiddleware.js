function authorize(roles = []) {
    return [
        async (req, res, next) => {
            try {
                const token = req.cookies.token;
                if (token) {
                    res.redirect('/');
                }
                else {
                    next();
                }

            } catch (error) {
                console.log('error: ' + error)
            }
        }
    ];
}

module.exports = authorize;