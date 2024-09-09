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
const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
module.exports = {
  async create(ctx) {
    // create user from firebase token
    ctx.request.body.uid = ctx.state.user.uid;
    console.log('.🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮 This is ctx.body.uid from api/firebase-user/controllers/firebase-uer.js : ', ctx.body.uid);
    //  uncomment the fields you have in content-type
    //  ctx.request.body.email = ctx.state.user.email;
    //  ctx.request.body.phoneNumber = ctx.state.user.phoneNumber;

    const entity = await strapi.services['firebase-user'].create(
      ctx.request.body
    );
    await strapi.firebase
      .auth()
      .setCustomUserClaims(ctx.state.user.uid, { strapi_uid: entity.id });
    return sanitizeEntity(entity, { model: strapi.models['firebase-user'] });
  },

  async update(ctx) {
    //update user while preventing the updates to user specific fields like uid, email
    const { id } = ctx.params;

    let entity;

    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('You can\'t update this entry');
    }

    if (id !== user.id) {
      return ctx.unauthorized('You can\'t update this entry');
    }

    if (ctx.is('multipart')) {
      let { data, files } = parseMultipartData(ctx);
      data.uid = user.uid; // a user must not update uid with req body (same goes for email also)
      //  uncomment the fields you have in content-type
      //  data.email = ctx.state.user.email;
      //  data.phoneNumber = ctx.state.user.phoneNumber;
      entity = await strapi.services['firebase-user'].update({ id }, data, {
        files,
      });
    } else {
      ctx.request.body.uid = user.uid; // a user must not update uid with req body (same goes for email also)
      //  uncomment the fields you have in content-type
      //  data.email = ctx.state.user.email;
      //  data.phoneNumber = ctx.state.user.phoneNumber;
      entity = await strapi.services['firebase-user'].update(
        { id },
        ctx.request.body
      );
    }
    return sanitizeEntity(entity, { model: strapi.models['firebase-user'] });
  },

  /**
   * Return logged in user for GET request at localhost:1337/firebase-users
   * @param {Context} ctx
   */
  async find(ctx) {
    console.log('.🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮 This is ctx from api/firebase-user/controllers/firebase-uer.js : ', ctx);
    // if ctx.response.status !== 200 {
    //   return ctx.response.status = 404;
    // }

    const [entity] = await strapi.services['firebase-user'].find({
      uid: ctx.state.user.uid, // find user associated with firebase uid
    });
    return sanitizeEntity(entity, { model: strapi.models['firebase-user'] });
  },

  async findOne(ctx) {
    return ctx.badRequest('req not found');
  },

  /**
   *
   * NONE EXCEPT ADMIN CAN DELETE USER
   */

  async delete(ctx) {
    ctx.badRequest('Bad Request');
  },
};
