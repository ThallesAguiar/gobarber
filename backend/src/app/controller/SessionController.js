require('dotenv').config() //.env
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Yup = require('yup')
const authConfig = require('../../config/auth')
const userModel = require('../model/User')

class SessionController {
    async store(req, res) {
        const schema = Yup.object().shape({
            email: Yup.string().email().required(),
            password: Yup.string().required()
        })
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' })
        }

        const { email, password } = req.body

        const user = await userModel.findOne({ email })
        // agora confiro se existe o usuario 
        if (!user)
            return res.status(401).json({ error: 'User not found' })

        try {
            await bcrypt.compare(password, user.password)
        } catch (err) {
            return res.status(401).json({ error: 'Password does not match' })
        }
        
        const { _id, name } = user

        return res.json({
            user: {
                _id,
                name,
                email,
            },
            token: jwt.sign(
                // 1º, é o payload
                { _id },
                // 2º, segredo para essa assinatura (uma string)
                authConfig.secret,
                // 3º, não obrigatório, a configuração para o jwt
                { expiresIn: authConfig.expiresIn }
            )
        })
    }
}


module.exports = new SessionController()