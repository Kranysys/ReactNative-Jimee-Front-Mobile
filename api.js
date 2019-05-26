
    export const api = "http://62.210.72.103:8001/";  // URL DE L'API
    let bearerToken = ""; // TOKEN POUR OAUTH2
    let userID = ""; // UserID Connecté actuellement
    let userInstaID = ""; // ID Compte instagram sélectionné de l'utilisateur connecté
    let userInsta = ""; // Compte instagramm sélectionné de l'utilisateur connecté

    // SETTER
    
    export function setToken(newValue) {
        bearerToken = newValue;
        console.log("SET bearerToken TO : "+bearerToken);
    }

    export function setUserID(newValue) {
        userID = newValue;
        console.log("SET userID TO : "+userID);
    }

    export function setUserInsta(userID, user) {
        userInstaID = userID;
        userInsta = user;
        console.log("SET userInstaID TO : "+userInstaID+" and userInsta TO : "+userInsta);
    }

    // GETTER

    export function getToken() {
        return bearerToken;
    }

    export function getUserID() {
        return userID;
    }

    export function getUserInstaID() {
        return userInstaID;
    }

    export function getUserInsta() {
        return userInsta;
    }