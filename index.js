const express = require('express');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
const path = require('path');



const app = express();


app.engine('.hbs', exphbs({ defaultLayout: 'layout', extname: ".hbs"}))
app.set('view engine', '.hbs')

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

app.get('/', (req, res)=> {
  res.render('index');
});

app.get('/about', (req, res)=> {
  res.render('about');
});

app.get('/project', (req, res)=> {
  res.render('project');
});

app.get('/contact', (req, res)=> {
    res.render('contact');
});

app.post('/contact', (req, res) => {
    const output = `
        <p>You have a new contact message</p>
        <h3>Contact Details</h3>
        <ul>
            <li>Name: ${req.body.name}</li>
            <li>Email: ${req.body.email}</li>
        </ul>
        <h3>Message</h3>
        <p>${req.body.message}</p>
    `;
    async function send(){
        // create reusable transporter object using the default SMTP transport
          let transporter = nodemailer.createTransport({
            host: "smtp.mailtrap.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
              user: 'test@test.com', // generated ethereal user
              pass: 'test1234', // generated ethereal password
            },
            tls: {
                rejectUnauthorized: false
            }
          });
        
          // send mail with defined transport object
            let config = await transporter.sendMail({
                from: '"Nodemailer Contact 👻" <test@test.com>', // sender address
                to: "test.test@gmail.com", // list of receivers
                subject: "Contact Form from viewers", // Subject line
                text: "Hello world?", // plain text body
                html: output, // html body
              });
        console.log("Message sent: %s", config.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(config));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        res.render('contact', { msg: "Email has been sent" })
      }
    send().catch(console.error())
    
})
        


app.listen(3000, () => console.log('Server is running on port 3000'));