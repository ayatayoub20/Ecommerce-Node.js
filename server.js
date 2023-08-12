const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const bodyParser = require('body-parser');
const ApiError = require('./utils/apiError')
const globalError = require('./middlewares/errorMiddleware')


dotenv.config({path:'config.env'})
const dbConnection = require('./config/database')
const categoryRoute = require('./routes/categoryRoute')
const subCategoryRoute = require('./routes/subCategoryRoute')
const brandRoute = require('./routes/brandRoute')
const productRoute = require('./routes/productRoute')




//conect with DB 
dbConnection();

//express app
const app = express();

//midleware
app.use(express.json());
app.use(bodyParser.json());

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
    console.log(`mode : ${process.env.NODE_ENV}`)
}

// mount routes
app.use('/api/categories', categoryRoute);
app.use('/api/subcategories', subCategoryRoute);
app.use('/api/brands', brandRoute );
app.use('/api/products', productRoute );




app.all('*' , (req, res, next)=>{
    next( new ApiError("cant find route", 400))
})

//Global error handling middleware for express
app.use(globalError);

const PORT = process.env.PORT || 8000
const server = app.listen(PORT , ()=>{
    console.log(`app running on port ${PORT}`)
})

// Handle rejection outside express
process.on('unhandledRejection', (err) => {
    console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
    server.close(() => {
      console.error(`Shutting down....`);
      process.exit(1);
    });
  });