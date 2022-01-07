const axios = require("axios");

exports.handler = async function (event, context) {
  const eventBody = JSON.parse(event.body);
  console.log(eventBody);
  const data = await axios({
    url: `https://judge.me/api/v1/products/${eventBody.external_id}`,
    method: "GET",
    data: {
        shop_domain: process.env.SHOP_DOMAIN,
        api_token: process.env.API_TOKEN,
      external_id: eventBody.external_id,
    },
  })
  .then((response) => {
    let product = response.data.product;

    return axios({
      url: `https://judge.me/api/v1/reviews/`,
      method: "GET",
      data: {
        shop_domain: process.env.SHOP_DOMAIN,
        api_token: process.env.API_TOKEN,
        product_id: product.id,
        per_page: eventBody.per_page,
        rating: eventBody.ratings,
      },
    });
  })
  .then((response) => {
    return response.data.reviews;
  });

  return {
    statusCode: 200,
    body: JSON.stringify(data),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET, POST, OPTION",
    },
  };
};
