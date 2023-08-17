import { getUser } from "../service/auth.js";

export function checkForAuthentication(request, response, next) {
    const tokenCookie = request.cookies?.token;
    request.user = null;

    if (!tokenCookie) return next();

    const token = tokenCookie;
    const user = getUser(token);

    request.user = user;

    return next();
}

export  function restrictTo(roles) {
    return function(request, response, next) {
        if (!request.user) return response.status(401).json({ success: false, message: "Invalid Credentials" });
        if (!roles.includes(request.user.role)) return response.status(401).json({ success: false, message: "UnAuthorized" });
        return next();
    }
}

// export function checkForAuthentication(request, response, next) {
//     const autherizationHeaderValues = request.headers["autherization"];
//     request.user = null;

//     if (!autherizationHeaderValues || !autherizationHeaderValues.startsWith('Bearer')) return next();

//     const token = autherizationHeaderValues.split("Bearer ")[1];
//     const user = getUser(token);

//     request.user = user;

//     return next();
// }

// export  function restrictTo(roles) {
//     console.log(roles, "here")
//     return function(request, response, next) {
//         console.log(request.user?.role)
//         if (!request.user) return response.status(401).json({ success: false, message: "Invalid Credentials" });
//         if (!roles.includes(request.user.role)) return response.status(401).json({ success: false, message: "UnAuthorized" });
//         return next();
//     }
// }

export async function restrictToLoggedinUserOnly(request, response, next) {
    // const userUid = request.headers["authorization"];
    // if (!userUid) {
    //   return response.status(401).json({ success: false, message: "Invalid credentials" });
    // }
    // const token = userUid.split("Bearer ")[1];
    // const user = getUser(token);
    // if (!user) {
    //   return response.status(401).json({ success: false, message: "Invalid User" });
    // }
    // response.user = user;
    // next();
  }
  
  export async function checkAuth(request, response, next) {
    // const userUid = request.cookies?.uid;
    // if (!userUid) {
    //   // Handle missing authentication (e.g., send 401 or redirect to login)
    //   return response.status(401).json({ success: false, message: "Authentication required" });
    // }
    // const user = getUser(userUid);
    // request.user = user;
    // next();
  }

// export async function restrictToLoggedinUserOnly(request, response, next) {
// //   const userUid = request.cookies.uid;

// console.log(request.headers)
// const userUid = request.headers["authorization"];

//   if (!userUid) return response.status(404).json({success: false, message: "Invalid credentials"});

//   const token = userUid.split("Bearer ")[1];
//   const user = getUser(token);

//   if (!user) return response.status(404).json({success: false, message: "Invalid User"});

//   response.user = user;
//   next();

// }


// export async function checkAuth (request, response, next) {
//     const userUid = request.cookies?.uid;
//     const user = getUser(userUid);
//     request.user = user;
//     next();
// }