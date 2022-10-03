const grpc = require('grpc');
const loader = require('@grpc/proto-loader');
const package = loader.loadSync('user.proto', {});
const object = grpc.loadPackageDefinition(package);
const userPackage = object.userPackage;


const client  = new userPackage.User('localhost:5000', grpc.credentials.createInsecure())   


// client.createUser({email: email, firstName: firstName, lastName: lastName, phoneNumber: phoneNumber, gender: gender, password: password}, (error, response) => {
//     console.log("Error : ", error); 
//     console.log("Response : ", response); 
// });

exports.getUserDetails = function(email, callback){
    console.log(email);
    client.readUser({email: email}, (error, response)=> {
        console.log("Error: ", error);
        console.log("Response: ", response);

        callback(response);
    })
}