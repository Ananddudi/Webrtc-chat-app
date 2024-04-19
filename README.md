Hey,

This is web chat application deployed on subdomain of render.com. It has all best practices to build large production ready application for companies such as secure cookie lever of token management, New url based form handling, <b>LIVE</b> video chat one to one, Sending real time messages with video,audio,image in chunks,Sending emails using nodemailer used gmail as SMTP service, Handling asynchronous tasks with react-query, Socket.io implementation with real time communication,handshake and much more.  

Site is live on [Render](https://web-chat-9hur.onrender.com/) but since it is deployed on free domain the dynos or instance of render will be shutdown after 50 seconds inactivity. so you may need to wait until dynos up and running again</br>
<label for="cars">Choose a car:</label>

<details>
  <summary>Here are my instructions for how to work with this project in your local development</summary>
  
  - Clone "development" branch in your local enviroment AND run "npm i" in both frontend,backend Directory.
  - Comment in this line in backend server.js file </br>
// const { createServer } = require("node:https");</br>
// const key = fs.readFileSync("cert.key");</br>
// const cert = fs.readFileSync("cert.crt");</br>
// const httpServer = createServer({ key, cert }, app);</br>
 - Comment out these lines </br>
const httpServer = http.createServer(app);</br> 
const http = require("http");</br>
- Acquire your public ip using "ipconfig" in powershell.
- After copying ip added these ip at five place backend env SERVER_URL,SERVER_URL; 
- Now you when you do "npm start" on backend it will start as https server with fake certs.
- On frontend you will have to enable HTTPS=true and HOST=0.0.0.0 so it can be accessed in same network with different devices for testing webrtc camera functionality.
- At last you will need to bypass chrome warning for both enviroment frontend and backend on first opening the site. 
</details>


Have a nice day :)
