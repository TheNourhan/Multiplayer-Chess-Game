

const check_session = (req, res, next)=>{
    if(req.session.username){
        var payload = {
            pageTitle:  "Find an Opponent",
            logUsername :  req.session.username,
            searchedUsername: ''
        }
        res.status(200).render("find-opponent", payload);
    }else{
        res.send('invalid user');
    }
};

const find_searched_user = (async(req, res, next)=>{
    try {
        let searchedUsername = req.body['find-by-username'];
        const logUsername = req.body['hidden-username'];
        const activeUsers = req.session.activeUsers || [];
       
        if (!activeUsers.includes(searchedUsername)) {
            
            var payload = {
                pageTitle:  "Find an Opponent",
                logUsername: logUsername,
                searchedUsername: '-1',
            };
            res.status(201).render("find-opponent", payload);
            
        }else{
            var payload = {
                pageTitle:  "Find an Opponent",
                logUsername: logUsername,
                searchedUsername: searchedUsername,
            };
            res.status(201).render("find-opponent", payload);
        }
       
    } catch (error) {
        console.error("Error processing find-opponent:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = {
    check_session,
    find_searched_user
};