//& By leveraging the backend customization lifecycle hook linked in the strapi documentation below, you can add your own business logic b
//& before or after one of the hook functions are called
//* https://www.udemy.com/course/a-complete-guide-to-the-jamstack-and-react-e-commerce/learn/lecture/22221234#notes
//& In this Udemy tutorial, he goes over how he sets up a lifecycle method from the documentation in Strapi here:
//* https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#models
//& With the code below, we have set up a lifecycle method for before a user is finished being created we are calling the Stripe api to generate a Stripe ID
//& And we are thereby associating that with our user... this is a good place to do any business logic before a user is created
//& Automatically adding a Stripe id for our user, whenever they sign up for our application so that

var stripe = require('stripe')(`${process.env.STRIPE_SK}`);

module.exports = {
  lifecycles: {
    // Called before an entry is created
    async beforeCreate(data) {
      const customer = await stripe.customers.create({
        name: data.username,
        email: data.email,
      });

      data.stripeID = customer.id;

      data.paymentMethods = [
        { brand: '', last4: '' },
        { brand: '', last4: '' },
        { brand: '', last4: '' },
      ];

      data.contactInfo = [
        { name: data.username, email: data.email, phone: '' },
        { name: '', email: '', phone: '' },
        { name: '', email: '', phone: '' },
      ];

      data.locations = [
        { street: '', zip: '', city: '', state: '' },
        { street: '', zip: '', city: '', state: '' },
        { street: '', zip: '', city: '', state: '' },
      ];
    },
  },
};
