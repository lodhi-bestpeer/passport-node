
const LocalStrategy = require("passport-local")
const User = require("../model")


exports.LocalStrategyPassport = (passport)=>{
    passport.use(new LocalStrategy(async(username,password,done)=>{
        try {
            const user = await User.findOne({username})
            if(!user) return done(null, false)
            if(user.password !== password)return done(null, false)
            return done(null, user)
            
        } catch (error) {
           return done(error, false)
        }
    })),

    passport.serializeUser( (user, done) => { 
        // console.log(`--------> Serialize User`)
        // console.log(user)  
        done(null, user.id)

    }),

    passport.deserializeUser(async(id, done) => {
        try {
            const user = await User.findById(id)
            done (null, user )
        } catch (error) {
            done (error,  false)
        }
    }) 
}


exports.isAuthenticate = (req, res, nest)=>{
    if(req.user)return nest()
    res.redirect("/login")
}