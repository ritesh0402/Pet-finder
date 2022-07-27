const nodemailer=require('nodemailer');

const transporter=nodemailer.createTransport(
{
	service:"hotmail",
	auth:{
		user:"node1234561@outlook.com",
		pass:"@NodeMail123"
	}
});

const options={
	from:"node1234561@outlook.com",
	to:"reciever2022@outlook.com",
	subject:"Request Acknowledgement",
	text:"Your request for adoption is recieved and you will get to know more details in 3-4 days"
};


transporter.sendMail(options,function(err,info)
{
	if(err) 
	{
		console.log(err)
		return;
	}
	console.log("Sent:"+info.response)
}) 

