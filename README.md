Overview
This project is a backend server built with Express.js. It provides endpoints for user authentication, registration, and profile management. The application uses JWT for authentication and PostgreSQL for data storage.

Features
User Registration
User Login
User Profile Retrieval (authenticated)

User can view product, product details, add product to cart.

Seller can add product, edit product and delete product.


Prerequisites
Node.js (v14 or later)
PostgreSQL
npm (or yarn)


Clone the Repository

Navigate to the Project Directory : cd your-repo-name

Install Dependencies : npm install

You can get these Posgres URl from vercel Postgres Database config.
Create a .env file in the root directory of the project and add the following:

JWT_SECRET=12345

POSTGRES_URL="postgres://..."
POSTGRES_PRISMA_URL="postgres://.."
POSTGRES_URL_NO_SSL="postgres://...."
POSTGRES_URL_NON_POOLING="postgres://..."
POSTGRES_USER="default"
POSTGRES_HOST="...."
POSTGRES_PASSWORD="...."
POSTGRES_DATABASE="...."

run command: 
node index.js || nodemon index.js
