// const asyncHandler = require("express-async-handler");
// const jwt = require("jsonwebtoken");

// const validateToken = asyncHandler(async (req, res, next) => {
//     let token;
//     let authHeader = req.headers.authorization || req.headers.Authorization;
//     if(authHeader && authHeader.startsWith("Bearer")) {
//         token = authHeader.split(" ")[1];
//         jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//             if(err) {
//                 res.status(401);
//                 throw new Error("User is not Authorized");
//             }
//             req.user = decoded.user;
//             console.log(req.user);
            
//             next();
//         });
//     }
//     if(!token) {
//         res.status(401);
//         throw new Error("UnAuthorized user");
//     }
// });

// module.exports = {validateToken};
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.headers.authorization || req.headers.Authorization;

    // Log the Authorization header
    //console.log("Authorization Header:", authHeader);

    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];

        // Log the token to ensure it's parsed correctly
        console.log("Token:", token);

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error("JWT Verification Error:", err.message);
                res.status(401);
                throw new Error("User is not Authorized");
            }

            req.user = decoded; // Ensure you're passing the decoded user payload
            console.log("Decoded User:", req.user);

            next();
        });
    } else {
        res.status(401);
        throw new Error("UnAuthorized user: Token missing or malformed");
    }
});

module.exports = { validateToken };
