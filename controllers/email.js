const fetch=require('node-fetch');
require('dotenv').config()
async function sendMail(to,code){
 
  const email = {
    to: to,
    subject: 'Email Verification',
    htmlBody:`<p>Thank you for registering for our messaging services</p> 
            <div style="text-align:center;"><b>${code}</b></div>`
  };
  try{
      const res=await fetch('https://script.google.com/macros/s/AKfycbwTUHmUagQJ1Cyhisqjm0qXdGdoNBYMKVxgcceIkVpOKE3zG6kojduHYbB66-SnuLdcew/exec',{
      method:'POST',
      body:JSON.stringify({
        type:"sendEmail",
        key:process.env.key,
        email:email
      })
    })
    let s=await res.json()
    console.log(s)
  }
  catch(e){
    console.log(e.message)
  }

}

module.exports=sendMail