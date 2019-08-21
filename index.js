/*
*  primary file for the API
*
*/

// dependencies
const http = require("http");
const https = require("https");
const url = require("url");
const stringDecoder = require("string_decoder").StringDecoder;
const config = require("./config");
const fs = require("fs");

// Instantiate the HTTP server
const httpServer = http.createServer((req,res)=>{
  unifiedServer(req,res);
});

// Start the HTTP server and listen to the port 3000
httpServer.listen(config.httpPort,()=>{
  console.log(`Sever started with port number ${config.httpPort} on ${config.envName}`);
});

// Instantiate the HTTPs server
const httpServerOptions = {
  "key": fs.readFileSync("./https/key.pem"),
  "cert": fs.readFileSync("./https/cert.pem")
}
const httpsServer = https.createServer(httpServerOptions,(req,res)=>{
  unifiedServer(req,res);
});

// Start the HTTPS server and listen to the port 3000
httpsServer.listen(config.httpsPort,()=>{
  console.log(`Sever started with port number ${config.httpsPort} on ${config.envName}`);
});

const unifiedServer = (req,res)=>{
  // Get the URl and parse it
  const parsedUrl = url.parse(req.url,true);

  //Get the path from the parsed URl
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  //Get query parameter AS A object
  const queryStringObject = parsedUrl.query;

  //Get the header
  const headers = req.headers;

  // Get the Requested method
  const method = req.method.toLowerCase();
// parse the payload
  const decoder = new stringDecoder("utf-8");
  let buffer = "";

  req.on("data",(data)=>{
    buffer+= decoder.write(data);
  })

  req.on("end",()=>{
    buffer+= decoder.end();

    //Check the router fo rmatched path, if not found use notFound handler

    var matchedHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handler.notFound;
    //console.log("matchedHandler :", handler.notFound);

    var data = {
      'trimmedPath' : trimmedPath,
      'queryStringObject' : queryStringObject,
      'method' : method,
      'headers' : headers,
      'payload' : buffer
    };
    matchedHandler(data,(statusCode,payload)=>{
      // Use the status code returned from the handler or use the default staus code 200
      statusCode = typeof(statusCode) == 'number' ? statusCode: 200;

      // use the payload from the handler or use empty object
      payload = typeof(payload) == "object" ? payload : {};


      // Convert the payload to a string
      let payloadString = JSON.stringify(payload);
      // send the response
      res.setHeader('content-type','application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

      //log the request path
      // console.log("Requested path ", trimmedPath, " \nwith a method : ",method,"\nand query :", queryStringObject,
      //                   "\nand header : ", headers,
      //                 "\nPayload : ",buffer);
      console.log("Response -",statusCode," : ",payloadString);
    });

  });
}

const handler = {};

// sample handler
handler.sample = (data,callback)=>{
  callback(406,{"data":"samplw handler"});
}

// Not found handler handler
handler.notFound = (data,callback)=>{
  callback(404);
}

const router = {
  "sample":handler.sample
}
