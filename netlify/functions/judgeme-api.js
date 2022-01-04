const axios = require("axios");

exports.handler = async function (event, context) {
  const eventBody = JSON.parse(event.body);

  const data = await axios({
    url: `https://judge.me/api/v1/products/${eventBody.external_id}`,
    method: "GET",
    data: {
      shop_domain: "shopd4.myshopify.com",
      api_token: "yxHawPYN3RFOtzH7W_dkgSeVJP4",
      external_id: eventBody.external_id,
    },
  })
  .then((response) => {
    let product = response.data.product;

    return axios({
      url: `https://judge.me/api/v1/reviews/`,
      method: "GET",
      data: {
        shop_domain: "shopd4.myshopify.com",
        api_token: "yxHawPYN3RFOtzH7W_dkgSeVJP4",
        product_id: product.id,
        per_page: eventBody.per_page,
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
