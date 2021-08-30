import { apiStatus } from '../../../lib/util'
import { Router } from 'express'
import axios from 'axios';

module.exports = ({ config }) => {
  const api = Router()

  api.post('/fetch-orderDetails', async (req, res) => {
    try {
      try {
        const orderDetails = req.body;
        console.log('orderDetails', orderDetails, config.magento2.api.url)
        const orderResponse = await axios.post(
          config.extensions.orderDetails.endpoint + '/rest/default/V1/w10/orderdata',
          orderDetails,
          {
            headers: {
              'Content-type': 'application/json'
            }
          }
        );
        console.log('orderResponse', orderResponse.data);
        apiStatus(res, orderResponse.data);
      } catch (error) {
        console.error(error);
        apiStatus(
          res,
          'This Some Error Occurred while processing order details',
          500
        );
      }
    } catch (error) {
      console.error(error);
      apiStatus(res, 'That Some Error Occurred while order details', 500);
    }
  });
  return api;
}
