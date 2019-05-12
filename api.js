
    export const api = "http://62.210.72.103:8001/";  // URL DE L'API
    let bearerToken = ""; // TOKEN POUR OAUTH2
    let userID = ""; // UserID Connecté actuellement
    let userInstaID = ""; // ID Compte instagram sélectionné de l'utilisateur connecté

    // SETTER
    
    export function setToken(newValue) {
        bearerToken = newValue;
        console.log("SET bearerToken TO : "+bearerToken);
    }

    export function setUserID(newValue) {
        userID = newValue;
        console.log("SET userID TO : "+userID);
    }

    export function setUserInstaID(newValue) {
        userInstaID = newValue;
        console.log("SET userInstaID TO : "+userInstaID);
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