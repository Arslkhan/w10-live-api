import {apiStatus} from '../../../lib/util';
import {Router} from 'express';
import axios from 'axios';

module.exports = ({config}) => {
  let api = Router();

  api.post('/update', async (req, res) => {
    try {
      try {
        const redirectDetails = req.body;

        let url = config.extensions.marketing.endpoint + '/rest/default/V1/w10/marketing';
        console.log('url', url);

        const searchRedirectResponse = await axios.post(url,
          redirectDetails,
          {
            headers: {
              'Content-type': 'application/json'
            }
          }
        );
        console.log(searchRedirectResponse);
        apiStatus(res, searchRedirectResponse.data);
        
      } catch (error) {
        console.error(error);
        apiStatus(
          res,
          {
            message: 'Some Error Occurred while processing fetching redirect Url',
            reqBody: req.body,
            error
          },
          500
        );
      }
    } catch (error) {
      console.error(error);
      apiStatus(res, 'That Error Occurred while processing fetching redirect Url', 500);
    }
  });
  return api;
};