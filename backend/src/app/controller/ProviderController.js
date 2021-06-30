const userModel = require('../model/User');

class ProviderController {
    async index(req , res ) {
        const providers = await userModel.find({provider:true},['_id', 'name','email', 'avatar']).populate('avatar',['name', 'path', 'url']);

        return res.json(providers)
    }
}


module.exports = new ProviderController();