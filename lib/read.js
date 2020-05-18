const path = require('path');
const axios = require('axios').default;

module.exports = async (file, options) => {
  const {data} = await axios(
    Object.assign({}, options, {
      url: path.isAbsolute(file) ? file : `/${file}`,
      method: 'GET',
    })
  );

  return data;
};
