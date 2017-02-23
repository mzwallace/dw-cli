const axios = require('axios');
const {parseString} = require('xml2js');
const get = require('lodash/get');
const forEach = require('lodash/forEach');

module.exports = async (file, options) => {
  try {
    const {data} = await axios(
      Object.assign({}, options, {
        headers: {
          Depth: 1
        },
        url: `/${file}`,
        method: 'PROPFIND'
      })
    );
    return await new Promise((resolve, reject) => {
      parseString(data, (err, res) => {
        if (err) {
          return reject(err);
        }

        resolve(
          res.multistatus.response.map(file => {
            const info = get(file, 'propstat.0.prop.0');
            forEach(info, (value, name) => {
              info[name] = get(value, '0');
            });
            return info;
          })
        );
      });
    });
  } catch (err) {
    console.log(err);
    return new Error(err);
  }
};
