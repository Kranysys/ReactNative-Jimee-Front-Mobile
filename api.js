
    const api = "http://62.210.72.103:8001/";  // URL DE L'API
    let bearerToken = ""; // TOKEN POUR OAUTH2

    export function setValue(newValue) {
        bearerToken = newValue;
    }

export { api, bearerToken };