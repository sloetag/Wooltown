const fs = require('fs');
let content = fs.readFileSync('src/pages/Checkout.tsx', 'utf-8');
content = content.replace(
  /country: countryValue/,
  `country: countryValue,
        userId: user ? user.id : 'guest',
        customerName: data.name,
        customerEmail: data.email,
        shippingAddress: {
          address: data.address,
          city: data.city,
          zip: data.zip,
          country: countryValue
        },
        paymentMethod: cardType || 'Card'`
);

content = content.replace(
  /const updatedOrders = \[newOrder, \.\.\.existingOrders\];\n        localStorage\.setItem\(usersOrdersKey, JSON\.stringify\(updatedOrders\)\);\n      }/,
  `const updatedOrders = [newOrder, ...existingOrders];
        localStorage.setItem(usersOrdersKey, JSON.stringify(updatedOrders));
      }

      // Add to global admin orders
      try {
        const globalOrdersKey = 'wooltown_orders';
        const globalOrdersOutput = localStorage.getItem(globalOrdersKey);
        let globalOrders = globalOrdersOutput ? JSON.parse(globalOrdersOutput) : [];
        if (!Array.isArray(globalOrders)) globalOrders = [];
        globalOrders = [newOrder, ...globalOrders];
        localStorage.setItem(globalOrdersKey, JSON.stringify(globalOrders));
      } catch (err) {}`
);
fs.writeFileSync('src/pages/Checkout.tsx', content);
console.log('Done Checkouts');
