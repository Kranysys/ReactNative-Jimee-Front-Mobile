
    const api = "http://62.210.72.103:8001/";  // URL DE L'API
    let bearerToken = ""; // TOKEN POUR OAUTH2
    let userID = 1; // UserID Connecté actuellement
    let instaUserID = 1; // ID Compte instagram sélectionné de l'utilisateur connecté

    export function setToken(newValue) {
        bearerToken = newValue;
    }

    export function setUserID(newValue) {
        userID = newValue;
    }

    export function setInstaUserID(newValue) {
        instaUserID = newValue;
    }

export { api, bearerToken, userID };