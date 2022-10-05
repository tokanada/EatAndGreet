const User = require("../models/user");

exports.addUser = async(req, res) => {
    try {
        //const hashedPW = bcrypt.hashSync(req.body.password, 12);

        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        });

        await user.save();

        // const token = jwt.sign({
        //     email: user.email,
        //     userId: user._id.toString
        // }, secret, { expiresIn: '2h' });

        // Generate and Send RES with Cookie
        res.send(user);
    } catch (error) {
        const status = error.statuscode || 500;
        res.status(status).json({ error: error.data });
    }
}

exports.listCurrentUsers = async(req, res) => {
    const users = await User.find({});

    try {
        res.send(users);
    } catch (error) {
        res.status(500).send(error);
    }
}