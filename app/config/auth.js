module.exports =
{
    'facebookAuth' : {
        'clientID'      : process.env.FACEBOOK_APP_ID,
        'clientSecret'  : process.env.FACEBOOK_SECRET_KEY,
        'callbackURL'   : process.env.FACEBOOK_CALLBACK_URL
    },

    'googleAuth' : {
        'clientID'      : process.env.GOOGLE_APP_ID,
        'clientSecret'  : process.env.GOOGLE_SECRET_KEY,
        'callbackURL'   : process.env.GOOGLE_CALLBACK_URL
    }

};
