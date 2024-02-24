const twilio = require('twilio');

// Twilio credentials from environment variables or configuration file

const client = new twilio(accountSid, authToken);

const sendSmsVerification = async (phoneNumber) => {
  try {
    console.log("line 12", phoneNumber)
    const verification = await client.verify.v2.services(serviceSid)
                                         .verifications
                                         .create({ to: phoneNumber, channel: 'sms' });
    return verification;
  } catch (error) {
    console.error("Error in sending SMS verification:", error);
    throw error;
  }
};

const verifySmsCode = async (phoneNumber, code) => {
  try {
    const verificationCheck = await client.verify.v2.services(serviceSid)
                                             .verificationChecks
                                             .create({ to: phoneNumber, code });
    return verificationCheck;
  } catch (error) {
    console.error("Error in verifying SMS code:", error);
    throw error;
  }
};

module.exports = {
  sendSmsVerification,
  verifySmsCode
};