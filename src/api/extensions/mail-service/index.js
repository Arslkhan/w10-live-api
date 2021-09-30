import { apiStatus } from '../../../lib/util'
import { Router } from 'express'
import EmailCheck from 'email-check'
import jwt from 'jwt-simple'
import NodeMailer from 'nodemailer'
import axios from 'axios';

module.exports = ({ config }) => {
  const msApi = Router()
  let token

  msApi.post('/update', async (req, res) => {
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
  /**
   * GET send token to authorize email
   */
  msApi.get('/get-token', (req, res) => {
    token = jwt.encode(Date.now(), config.extensions.mailService.secretString)
    apiStatus(res, token, 200)
  })

  /**
   * POST send an email
   */
  msApi.post('/send-email', (req, res) => {
    const userData = req.body
    if (!userData.token || userData.token !== token) {
      apiStatus(res, 'Email is not authorized!', 500)
    }
    const { host, port, secure, user, pass } = config.extensions.mailService.transport
    if (!host || !port || !user || !pass) {
      apiStatus(res, 'No transport is defined for mail service!', 500)
    }
    if (!userData.sourceAddress) {
      apiStatus(res, 'Source email address is not provided!', 500)
      return
    }
    if (!userData.targetAddress) {
      apiStatus(res, 'Target email address is not provided!', 500)
      return
    }
    // Check if email address we're sending to is from the white list from config
    const whiteList = config.extensions.mailService.targetAddressWhitelist
    const email = userData.confirmation ? userData.sourceAddress : userData.targetAddress
    if (!whiteList.includes(email)) {
      apiStatus(res, `Target email address (${email}) is not from the whitelist!`, 500)
      return
    }


    const replyAddress = userData.replyAddress ? userData.replyAddress : ''
    //const replyAddress = 'clintonjoubert@gmail.com'
    //const command = ""

    const command = "/var/www/html/sendemail/StockManagement sendemail " + userData.targetAddress + " " + encodeURIComponent(userData.subject) + " '" + encodeURIComponent(userData.emailText) + "' " + replyAddress
    
    

    const fs = require('fs');
    fs.writeFileSync('/var/www/html/sendemail/mail.log', command);
  
    const { exec } = require("child_process");
    exec(command, (error, stdout, stderr) => {
      if (error) {
        apiStatus(res, error, 500)
          
          return;
      }
      if (stderr) {
        apiStatus(res, stderr, 500)
         
          return;
      }
     
      apiStatus(res, 'OK', 200)
    });
  apiStatus(res, 'OK', 200)


   /* let transporter = NodeMailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass
      }
    })
    const mailOptions = {
      from: userData.sourceAddress,
      to: userData.targetAddress,
      subject: userData.subject,
      text: userData.emailText
    }
    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        apiStatus(res, error, 500)
        return
      }
      apiStatus(res, 'OK', 200)
      transporter.close()
    })
    */


    // check if provided email addresses actually exist
    
    /*
    EmailCheck(userData.sourceAddress)
      .then(response => {
        if (response) return EmailCheck(userData.targetAddress)
        else {
          apiStatus(res, 'Source email address is invalid!', 500)
        }
      })
      .then(response => {
        if (response) {
          let transporter = NodeMailer.createTransport({
            host,
            port,
            secure,
            auth: {
              user,
              pass
            }
          })
          const mailOptions = {
            from: userData.sourceAddress,
            to: userData.targetAddress,
            subject: userData.subject,
            text: userData.emailText
          }
          transporter.sendMail(mailOptions, (error) => {
            if (error) {
              apiStatus(res, error, 500)
              return
            }
            apiStatus(res, 'OK', 200)
            transporter.close()
          })
        } else {
          apiStatus(res, 'Target email address is invalid!', 500)
        }
      })
      .catch(() => {
        apiStatus(res, 'Invalid email address is provided!', 500)
      })
    */
  })

  return msApi
}
