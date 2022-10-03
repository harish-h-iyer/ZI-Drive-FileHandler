const config = require("config");
const logger = require("../config/logger/logger");
const KEY = config.get('SECRET_KEY');
const EXPIRES = config.get('EXPIRES_IN');
const jwt = require("jsonwebtoken");

const authClient = require("../Auth");

module.exports = async function(req, res, next) {
    var token = req.headers.authorization.split(" ")[1];

    authClient.getTokenDetails(token, function(response){
        console.log(response)
        if(Object.keys(response).length != 0){
            if(response.message.includes("token")){
                jwt.verify(token, KEY, function(err, decode){
                    if(err){
                        return res.status(401).json({
                            message: "Unauthorized"
                        })
                    }else{
                        console.log(decode);
                        req.user = decode;
                        next();
                    }
                }); 
            }else{
                return res.status(401).json({
                    message: "Unauthorized"
                })
            }
        }else{
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

    });
}