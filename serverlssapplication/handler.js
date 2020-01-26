'use strict';

const SDK=require('aws-sdk');
const uuid=require('uuid');
const jwt = require('jsonwebtoken');
const dynamodb= new SDK.DynamoDB.DocumentClient({
  region: 'localhost',
  endpoint: 'http://localhost:8000'
});

module.exports.generateToken = async (et,context) => {
  
  process.env.JWT_SECRET='hhh'
  const JWT_EXPIRATION_TIME = '5m';
  try{
  const token = jwt.sign({ key: 'tar' }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRATION_TIME });
  process.env.token=token;
    return { // Success response
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        token,
      }),
    };

    // Return response
   
  } catch (e) {
    return{ // Error response
      statusCode: 401,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: e.message,
      }),
    };
    
  }
}

module.exports.authorize = async (et,context) => {
  
  try{
    console.log(process.env.token );
    console.log(process.env.JWT_SECRET);
  const decoded = jwt.verify(process.env.token, process.env.JWT_SECRET);
  console.log(decoded);
  const key = decoded.key;
  console.log(key); 
  if(key !=='tar')
  {
    throw new error("not authorized");
  }
console.log(key+"2");
  return {
    "principalId": "tar",
    "policyDocument": {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Action": "execute-api:Invoke",
          "Effect": "Allow",
          "Resource": "*"
        }
      ]
    }
  };
  }catch(err)
  {
    return {
      error:'not authorized'
    }
  }

}

module.exports.create = async (et,context) => {
const data=JSON.parse(et.body);
const a={};
console.log(data);
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: uuid.v1(),
      text: data.name,
   
    },
  };


  try{ 
  let data =await dynamodb.put(params).promise();
  console.log(data)
  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
  
 
  }catch(err)
  {
      console.error(err);
      return  {
        statusCode: a.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: a.body
      };
  }
  // const response= {
  //   statusCode: 200,
  //   body: et.body
  // };
  // console.log(response)
  // callback(null,response);

}




module.exports.list = async (et,ctxt,callback) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
  };
  try{ 
    let data =await dynamodb.scan(params).promise();
    console.log(data)
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
    
   
    }catch(err)
    {
        console.error(err);
        return  {
          statusCode: data.statusCode || 501,
          headers: { 'Content-Type': 'text/plain' },
          body: data.body
        };



    }
}

module.exports.get = async (et,ctxt) => {

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: et.pathParameters.id,
    },
  };
  try{ 
    let data =await dynamodb.get(params).promise();
    console.log(data)
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
    
   
    }catch(err)
    {
        console.error(err);
        return  {
          statusCode: data.statusCode || 501,
          headers: { 'Content-Type': 'text/plain' },
          body: data.body
        };

  
}
}

module.exports.update = async (et,ctxt) => {

  const data = JSON.parse(et.body);
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: et.pathParameters.id,
    },
    ExpressionAttributeNames: {
      '#employee': 'text',
    },
    ExpressionAttributeValues: {
      ':text': data.name,
    },
    UpdateExpression: 'SET #employee = :text',
    ReturnValues: 'ALL_NEW',
  };
let result ={};
  // update the todo in the database
  try{ 
    result =await dynamodb.update(params).promise();
    console.log(data)
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
    
   
    }catch(err)
    {
        console.error(err);
        return  {
          statusCode: data.statusCode || 501,
          headers: { 'Content-Type': 'text/plain' },
          body: result.body
        };

  
}  
}


module.exports.delete = async (et,ctxt,) => {

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: et.pathParameters.id,
    },
  };
let result;
  try{ 
    result =await dynamodb.delete(params).promise();
    console.log(result)
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
    
   
    }catch(err)
    {
        console.error(err);
        return  {
          statusCode: result.statusCode || 501,
          headers: { 'Content-Type': 'text/plain' },
          body: result.body
        };
}
}
