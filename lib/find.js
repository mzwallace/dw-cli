const axios = require('axios').default;
const path = require('path');
const {parseString} = require('xml2js');
const get = require('lodash/get');
const forEach = require('lodash/forEach');

module.exports = async (file, options) => {
  try {
    const {data} = await axios(
      Object.assign({}, options, {
        headers: {
          Depth: 1,
        },
        url: path.isAbsolute(file) ? file : `/${file}`,
        method: 'PROPFIND',
      })
    );
    return await new Promise((resolve, reject) => {
      parseString(data, (error, response) => {
        if (error) {
          return reject(error);
        }

        resolve(
          response.multistatus.response.map((file) => {
            const info = get(file, 'propstat.0.prop.0');
            forEach(info, (value, name) => {
              info[name] = get(value, '0');
            });
            return info;
          })
        );
      });
    });
  } catch (error) {
    console.log(error);
    return new Error(error);
  }
};
