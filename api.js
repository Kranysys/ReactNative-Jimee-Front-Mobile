
    const api = "http://62.210.72.103:8001/";  // URL DE L'API
    let bearerToken = ""; // TOKEN POUR OAUTH2
    let userID = 1; // UserID Connecté actuellement

    export function setToken(newValue) {
        bearerToken = newValue;
    }

    export function setUserID(newValue) {
        userID = newValue;
    }

export { api, bearerToken, userID };