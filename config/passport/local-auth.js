//Archivo para crear, guardar y validar las contraseñas

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');
const user = require('../models/user');

// Guarda los datos registrados para evitar estar realizando el registro de los datos en cada pagina que se abra

//serializa los datos
passport.serializeUser((user, done) => {
    done(null, user.id);
});
// consulta los datos del usuario y los devuelve aprobados
passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);

});

// Toma los datos de usuario y contraseña, y los registra en la base de datos

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {

    //validacion de datos existentes en la base de datos
   const user = await User.findOne({email: email});
    
    if (user) {
        return done(null, false, req.flash('signupMessage', 'The email is already.'));

    } else{

        const newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        await newUser.save();
        done(null, newUser);
    }    
    
}));

// proceso de autenticacion para el logeo

passport.use('local-signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, email, password, done) => {

   //validacion de datos existentes en la base de datos
   const user = await User.findOne({email: email});

   if (!user) {
    return done(null, false, req.flash('signinMessage', 'No user Found.'));

} 
    if(user.comparePassword(password)) {
        return done(null, false, req.flash('signinMessage','Incorrect Password'));
    }
    
    done (null, user);

}));