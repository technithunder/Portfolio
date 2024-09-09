//* https://www.udemy.com/course/a-complete-guide-to-the-jamstack-and-react-e-commerce/learn/lecture/22346552#notes
//* https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#controllers
//& Controllers are JavaScript files containing sets of methods called actions that you can access by requesting a specific route...
//* See here: https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#custom-controllers
//& In the example in the link above, there is a basic example where a GET request to /hello would return or send back a string
//& containing the word "Hello World".
//* See here: https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers
//& In the link above, it states that any time you create a new content type, a new set of controllers is created and strapi builds all the default controllers
//& for us, but then gives us a file that we can use to extend them or add custom ones to our own / override the default logic...
//& At 1:52 he mentions that this is why he sees the "Controllers" as "Custom logic living at end points that we can use to interact with the app's content"

//& The default controllers created for us include find, findOne, count, create, update, and delete as seen here:
//* https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#collection-type
//& If you look into what "find" does for example, it enables the endpoint for our GET request to properly function!
//& More specifically, what it does is it executes the "find" controller which goes and uses Strapi "services" to retrieve the data
//& Strapi "services" are other functions which Strapi has built that allows searching for a specific collection type (same as Content Type) query,
//& Or simply listing all of the available data for a specific collection type (same as Content Type)

//& CONTROLLERS SIMPLY CONTROL THE LOGIC AT SPECIFIC ENDPOINTS! (see above)

//* For comment below: https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#collection-type
//& At 6:26 he shows how they will copy the logic within "create" of the Collection Type example, and add it to your own controller file, and then you can go ahead &
//& add whatever code you want to extend it, and then Strapi will use your newly defined version

//* For comment below: https://strapi.io/documentation/developer-docs/latest/guides/is-owner.html#create-is-owner-policy
//& At 7:00 he goes into the creation process of the "is owner" policy which extends a core controller

//* For comment below: https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#utils
//& Here it shows that parseMultipartData from 'strapi-utils' is a function that is used to parse the data from the request body aka parses Strapi's formData format
//& and then it returns a JSON object with the data that was sent in the request body (aka the formData)
//& Also, sanitizeEntity from 'strapi-utils' is a function that removes all private fields from the model and its relations

'use strict';

const { sanitizeEntity } = require('strapi-utils');
const unparsed = require('koa-body/unparsed.js');

const sanitizeUser = user =>
  sanitizeEntity(user, {
    model: strapi.query('user', 'users-permissions').model,
  });

const getBody = (req) => new Promise((resolve, reject) => {
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });
  req.on('end', () => {
    resolve(JSON.parse(data));
  });
  req.on('error', () => {
    reject('Error');
  });

});

module.exports = {
  async auth(ctx, next) {
    await next();
    console.log('🪚🪚🪚🪚🪚🪚🪚🪚🪚 from api/firebase/controllers/firebase.js this is ctx : ', ctx.request.body);
    const unparsedBody = ctx.request.body[unparsed];
    const body = JSON.parse(unparsedBody);

    try {
      const idToken = body.token;
      console.log('request token: ', idToken);
      const decodedToken = await strapi.firebase
        .auth()
        .verifyIdToken(idToken);
      console.log('decodedToken: ', decodedToken);
      if (decodedToken.email) {
        let jwt;
        let user = await strapi.plugins['users-permissions'].services.user.fetch({
          email: decodedToken.email,
        });
        if (user) {
          user = sanitizeUser(user);

          jwt = strapi.plugins['users-permissions'].services.jwt.issue({
            id: user.id,
          });

          ctx.body = {
            user,
            jwt
          };
        } else {
          const pluginStore = await strapi.store({
            environment: '',
            type: 'plugin',
            name: 'users-permissions',
          });

          const settings = await pluginStore.get({
            key: 'advanced',
          });

          const role = await strapi
            .query('role', 'users-permissions')
            .findOne({ type: settings.default_role }, []);

          const params = {};
          params.role = role.id;
          params.email = decodedToken.email;
          params.username = decodedToken.email.split('@')[0];
          params.confirmed = true;

          let user = await strapi.query('user', 'users-permissions').create(params);
          if (user) {
            user = sanitizeUser(user);
            jwt = strapi.plugins['users-permissions'].services.jwt.issue({
              id: user.id,
            });

            ctx.body = {
              user,
              jwt
            };
          } else {
            throw 'user empty';
          }
        }
      } else {
        throw 'email missing';
      }
    } catch (error) {
      console.log(error.message);
      if(error.code === 'auth/id-token-expired')
      {
        return ctx.badRequest({errorCode: error.code}, [{code: error.code, message: error.message }]);
      }
      return ctx.badRequest(null, [{ messages: [{ id: 'unauthorized' }] }]);
    }
  },

};
