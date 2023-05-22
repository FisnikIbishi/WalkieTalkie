function authorize(roles = []) {
    return [
        async (req, res, next) => {
            try {
                const token = req.cookies.token;
                console.log('log token: ' + token)
                if (!token) {
                    res.redirect('/login');
                }

                res.redirect('/')
            } catch (error) { 
                console.log('error: ' + error)
            }
        }
    ];
}

module.exports = authorize;