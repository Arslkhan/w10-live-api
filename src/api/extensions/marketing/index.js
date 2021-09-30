import {apiStatus} from '../../../lib/util';
import {Router} from 'express';
import axios from 'axios';

module.exports = ({config}) => {
  let api = Router();

  api.post('/update', async (req, res) => {
    try {
      try {
        const customerUpdateDetails = req.body;

        let url = config.extensions.marketing.endpoint + '/rest/default/V1/w10/marketing';
        console.log('url', url);

        const customerUpdateResponse = await axios.post(url,
          customerUpdateDetails,
          {
            headers: {
              'Content-type': 'application/json'
            }
          }
        );
        console.log(customerUpdateResponse);
        apiStatus(res, customerUpdateResponse.data);
        
      } catch (error) {
        console.error(error);
        apiStatus(
          res,
          {
            message: 'Some Error Occurred while processing fetching customerUpdateResponse Url',
            reqBody: req.body,
            error
          },
          500
        );
      }
    } catch (error) {
      console.error(error);
      apiStatus(res, 'That Error Occurred while processing fetching customerUpdateResponse Url', 500);
    }
  });
  return api;
};