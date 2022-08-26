const nodemailer = require("nodemailer")
const transport = nodemailer.createTransport({
    host: "mx.mailslurp.com",
    port: 2525,
    secure: false,
    auth:{
        user:"0BiEwxnbz7zuNtR0XjpLxouNJ8ybnaYx",
        pass:"A2cDNJtfgMFMyg1Q8ZDEwTpXkl4HPuyt"
    }
})

async function sendMail(to,code){
  const options = {
    from:"0d2e2d21-f49c-4433-8cfe-eac4510a426b@mailslurp.com",
    to: [to],
    subject: 'Email Verification',
    html:`<p>Thank you for registering for our messaging services</p> 
            <div style="text-align:center;"><b>${code}</b></div>`
  };
  try{

      // await transport.sendMail(options)
  }
  catch(e){
    console.log(e.message)
  }
}

module.exports=sendMail