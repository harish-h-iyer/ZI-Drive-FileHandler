const grpc = require('grpc');
const loader = require('@grpc/proto-loader');
const package = loader.loadSync('auth.proto', {});
const object = grpc.loadPackageDefinition(package);
const authPackage = object.authPackage;

const client  = new authPackage.Auth('localhost:5001', grpc.credentials.createInsecure())

const token = process.argv[2];


exports.getTokenDetails = function(token, callback){
    client.getToken({token: token}, (error, response)=> {
        console.log("Error: ", error);
        console.log("Response: ", response);

        callback(response);
    })
}