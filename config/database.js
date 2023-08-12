const mongoose = require('mongoose');

const dbConnection = ()=> {
 mongoose
 .connect(process.env.DB_URL)
 .then((conn)=>{
    console.log(`database conncted ${conn.connection.host}`)
})
// .catch((err)=>{
//     console.error(`databas error : ${err}`)
//     process.exit(1)
// });
};

module.exports = dbConnection;