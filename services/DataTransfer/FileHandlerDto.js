exports.generateUserObject = function(data) {
    return {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        gender: data.gender
    }
}

exports.generateTokenObject = function(data, token) {
    return {
        email: data.email,
        token: token,
        created_at: new Date()
    }
}