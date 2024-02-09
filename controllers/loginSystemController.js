const bcrypt = require('bcrypt');
const User = require('../models/Users');

const login = (async(req, res, next)=>{
    try {
        const usernameOrEmail = req.body.logUsername;
        const password = req.body.logPassword;
        // Validate if usernameOrEmail and password are provided
        if (!usernameOrEmail || !password) {
            return res.status(400).send("Username or email and password are required.");
        }
        // Find the user by username or email
        const user = await User.findOne({
            $or: [
                { username: usernameOrEmail },
                { email: usernameOrEmail }
            ]
        });
        // Check if the user exists
        if (!user) {
            return res.status(200).render("login", {pageTitle: "Login", error: 'User does not exist'});
        }
        // Check if the password is correct
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).send("Invalid password.");
        }
        // Login successful
        req.session.username = usernameOrEmail;
        req.session.activeUsers = req.session.activeUsers || []; 
        req.session.activeUsers.push(usernameOrEmail);
        res.redirect(`/find-opponent?logUsername=${encodeURIComponent(usernameOrEmail)}`);
    } catch (error) {
        console.error("Error processing login:", error);
        res.status(500).send("Internal Server Error");
    }
});

const register =  (async(req, res, next)=>{
    console.log('req.body',req.body)
    
    try {                 
        var username = req.body.username.trim();
        var email = req.body.email.trim();
        var password = req.body.password;

        const oldEmail = await User.findOne({ email: email });
        const oldUser = await User.findOne({ username: username });
        if (oldUser || oldEmail) {
            console.log("double")
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });

        console.log('URL',{ URL: req.url });
        await newUser.save();

        res.status(200).redirect("/login");
       
    } catch (error) {
        console.error("Error processing registration:", error);
        res.status(error.status || 500).send(error.message || "Internal Server Error");
    }   
});

const logout = (async(req, res, next)=>{
    req.session.activeUsers = req.session.activeUsers || [];
    const index = req.session.activeUsers.indexOf(req.session.username);
    if (index !== -1) {
        req.session.activeUsers.splice(index, 1);
    }
    req.session.destroy(err => {
        if(err){
            console.error('Error destroying session:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.redirect('/login');
    });
});

module.exports = {
    login,
    register,
    logout
};