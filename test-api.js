const axios = require('axios');
async function testListing(){
try {
const response = await axios.post('http://localhost:3000/api/listings', {
address: "123 Test Street",
price: "$450,000", bedrooms: 3, bathrooms: 2, saft: 1800,
features: ["hardwood floors", "updated kitchen", "large backyard"], type: "House", city: "Test City", neighborhood: "Test Neighborhood"
});
console.log('Success:', response.data);
} catch (error) {
console.error ('Error:, error.response?.data || error.message');
}
}
testListing();