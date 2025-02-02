const crypto = require("crypto");

class Secrets {
    constructor(algorithm, secret) {
        this.algorithm = algorithm; 
        this.key = secret; 
    }

    encrypt(pass) {
        const cipher = crypto.createCipher(this.algorithm, Buffer.from(this.key));
        let passEnc = cipher.update(pass, 'utf8', 'hex');
        passEnc += cipher.final('hex');
        return passEnc;
    }
    
    decrypt(passEnc) {
        const decipher = crypto.createDecipher(this.algorithm, Buffer.from(this.key));
        let pass = decipher.update(passEnc, 'hex', 'utf8');
        pass += decipher.final('utf8');
        return pass;
    }
}

module.exports = Secrets;