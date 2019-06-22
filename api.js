
    export const api = "http://62.210.72.103:8001/";  // URL DE L'API
    let bearerToken = ""; // TOKEN POUR OAUTH2
    let userID = ""; // UserID Connecté actuellement
    let userInstaID = ""; // ID Compte instagram sélectionné de l'utilisateur connecté
    let userInsta = ""; // Compte instagramm sélectionné de l'utilisateur connecté
    var InstaAccountList; // Liste des comptes Instagram en cache

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

    export function clearAll() {
        bearerToken = "";
        userID = "";
        userInsta = "";
        userInstaID = "";
    }

    // LISTE DES COMPTES (CACHE)

    export function setInstaAccountList(json) {
        console.log(json);
        InstaAccountList = json;
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

    // LISTE DES COMPTES (CACHE)

    export function getInstaAccountList() {
        return InstaAccountList;
    }

    export function countInstaAccountList() {
        var str = JSON.stringify(InstaAccountList);
        //console.log("str : "+str+" len "+str.length);
        //var parse = JSON.parse(str);
        //let list = InstaAccountList;
        //console.log("count is "+Object.keys(list).length);
        if( InstaAccountList != undefined ){
            console.log("not un 1")
            console.log(InstaAccountList)
            if( InstaAccountList.lenght != undefined ){
                console.log("not un 2")
                return InstaAccountList.lenght;
            } else {
                console.log("undef 2 : "+Object.keys(InstaAccountList).length)
                return Object.keys(InstaAccountList).length;
            }
        } else console.log("InstaAccountList undef")
        return 0;
    }