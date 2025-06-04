# SCATCH-T 🚀

Welcome to SCATCH-T, a robust full-stack project built with the MERN (MongoDB, Express, React, Node.js) stack. This application features secure user authentication, protected routes, and token blacklisting using JWT. The backend provides endpoints for user management, product management, and owner management.

## Table of Contents
- [Installation](#installation)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
  - [Index Routes](#index-routes)
  - [User Routes](#user-routes)
  - [Owner Routes](#owner-routes)
  - [Product Routes](#product-routes)
- [Middleware](#middleware)
- [Model Creation Guidelines](#model-creation-guidelines)
- [Technologies Used](#technologies-used)
- [License](#license)

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Setup your `.env` file:**
   Create a `.env` file with the required variables such as `JWT_SECRET`, `MONGO_URI`, `OWNER_EMAIL`, and `OWNER_PASSWORD` (if needed).
4. **Run the project:**
   ```bash
   npm run dev
   ```

## Project Structure

- **Backend:** Contains server-side code.
  - `app.js`: Sets up middleware, static files, and routes.
  - `server.js`: Starts the HTTP server.
  - `routes/`: Defines Express routes (index, users, owner, products).
  - `controllers/`: Business logic for each route.
  - `models/`: Mongoose schemas for the database.
  - `services/`: Helper functions and business logic (e.g., product creation, user registration).
  - `middlewares/`: Authentication middlewares for users and owners.
  - `utils/`: Utility functions such as password hashing and token generation.
  - `config/`: Configuration files for database and secret keys.

## API Endpoints

### Index Routes

- **GET /**  
  *Protected route: accessible only after authentication.*  
  **Description:** Returns a welcome message.  
  **Middleware:** Uses authentication middleware to verify JWT.  
  **Example Response:**
  ```json
  { "message": "Welcome to the Landing Page!" }
  ```

### User Routes

_All user-related endpoints are prefixed with `/users`._

- **POST /users/register**  
  **Description:** Registers a new user.  
  **Request Body:**
  - `name` (string, required): Minimum 3 characters.
  - `email` (string, required): Valid email address.
  - `password` (string, required): Minimum 4 characters.
  - `mobile` (string, optional)
  - `image` (string, optional)
  
  **Response:**
  - **Status:** 201 Created  
  - Sets a JWT in the cookie and returns a JSON object with a success message and user details.

- **POST /users/login**  
  **Description:** Authenticates a user.  
  **Request Body:**
  - `email` (string, required)
  - `password` (string, required)  
  
  **Response:**
  - **Status:** 200 OK  
  - Sets a JWT in the cookie and returns a JSON object with a success message and user details.

- **GET /users/logout**  
  **Description:** Logs out the user by blacklisting the JWT and clearing the cookie.  
  **Response:**
  - **Status:** 200 OK  
  - Returns a JSON message confirming logout.

- **GET /users/profile**  
  **Description:** Returns the authenticated user’s profile data.  
  **Middleware:** Uses authentication middleware to verify JWT.  
  **Response:**
  - **Status:** 200 OK  
  - Returns a JSON object with the user information.

### Owner Routes

_All owner-related endpoints are prefixed with `/owner`._

- **POST /owner/register**  
  **Description:** Registers a new owner (only allowed in development mode).  
  **Request Body:**
  - `name` (string, required)
  - `email` (string, required, valid email)
  - `password` (string, required, minimum 6 characters)  
  
  **Response:**
  - **Status:** 200 OK (or 401 if an owner already exists or not allowed in production)
  - Sets a JWT in the cookie and returns a success message with owner details.

- **POST /owner/login**  
  **Description:** Logs in the owner.  
  **Request Body:**
  - `email` (string, required)
  - `password` (string, required)
  
  **Response:**
  - **Status:** 200 OK  
  - Sets a JWT in the cookie and returns a JSON object containing owner details.

- **POST /owner/logout**  
  **Description:** Logs out the owner.  
  **Flow:**
  - Validates and verifies the owner’s JWT.
  - Blacklists the token to prevent further use.
  - Clears the token cookie.
  
  **Response:**
  - **Status:** 200 OK  
  - Returns a confirmation JSON message.

### Product Routes

_All product-related endpoints are prefixed with `/products` and require owner authentication.*

- **POST /products/create**  
  **Description:** Creates a new product.  
  **Request Body:**
  - `name` (string, required): At least 3 characters.
  - `price` (number, required)
  - `discount` (number, required)
  - `bgColor` (string, required)
  - `panelColor` (string, required)
  - `textColor` (string, required)
  - `image` (string, optional): Default to a given URL if not provided.
  - `imgSection` (string, required): Specifies image section (enum: `home`, `news`, `footer`, `promo`)
  
  **Response:**
  - **Status:** 201 Created  
  - Returns a JSON message and the product details.

- **GET /products/allproducts**  
  **Description:** Retrieves a list of all products.  
  **Middleware:** Uses owner authentication.  
  **Response:**
  - **Status:** 200 OK  
  - Returns a JSON object with the list of products.

- **PUT /products/update/:id**  
  **Description:** Updates product details for the given product ID.  
  **Request Parameters:**
  - `id`: Product ID in the URL.
  
  **Request Body:** (Same validation as product creation)
  - `name`, `price`, `discount`, `bgColor`, `panelColor`, `textColor`, `image`, `imgSection`
  
  **Response:**
  - **Status:** 200 OK  
  - Returns a JSON message with updated product details.

- **DELETE /products/delete/:id**  
  **Description:** Deletes the product corresponding to the given product ID.  
  **Response:**
  - **Status:** 200 OK  
  - Returns a confirmation JSON message.

## Middleware

### Authentication Middleware for Users
- **Purpose:** Protects routes by checking the existence and validity of a JWT.
- **Flow:**
  1. Extracts token from cookies or Authorization header.
  2. Checks if token is blacklisted.
  3. Verifies token using `process.env.JWT_SECRET`.
  4. Retrieves the user from the database.
  5. Attaches user details to the request and calls `next()`.
  
  **Error:** Returns 401 Unauthorized if the token is missing, blacklisted, or invalid.

### Owner Authentication Middleware
- **Purpose:** Limits product management endpoints to authenticated owners.
- **Flow:**
  1. Allows access only if in development mode or if the token matches the configured owner email.
  2. Extracts and verifies the JWT.
  3. Retrieves the owner record from the database.
  4. Ensures that the email from JWT matches `process.env.OWNER_EMAIL`.
  
  **Error:** Returns 401/403 Unauthorized if the token is invalid, missing, or not matching the owner.

## Model Creation Guidelines

Models in SCATCH-T are created using Mongoose. Some key considerations include:

- **Required Fields:**  
  Fields like `name`, `email`, and `password` for the User and Owner models are marked as required.  
  
- **Validation and Defaults:**  
  Utilize Mongoose validations (e.g., minlength, unique constraints) and default values (e.g., default image URL for products).

- **Sensitive Data:**  
  For security, sensitive fields (like user passwords) are excluded from responses using options like `select: false`.

- **Timestamps:**  
  Most models make use of Mongoose’s timestamps to automatically handle creation and update dates.

### Examples

**User Model:**

```javascript
// filepath: e:\Full Stack Project\Scatch-T\Backend\models\userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 4,
        select: false,
    },
    mobile: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    cart: {
        type: Array,
        default: [],
    },
    product:{
        type: Array,
        default: [],
    }
});

module.exports = mongoose.model('User', userSchema);
```

**Product Model:**

```javascript
// filepath: e:\Full Stack Project\Scatch-T\Backend\models\productModel.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
        default: 'https://example.com/default-image.jpg',
    },
    imgSection: {
        type: String,
        enum: ['home', 'news', 'footer', 'promo'],
        required: true,
    },
    bgColor: {
        type: String,
        required: true,
    },
    panelColor: {
        type: String,
        required: true,
    },
    textColor: {
        type: String,
        required: true,
    },
});

productSchema.index({ name: 1 });
module.exports = mongoose.model('Product', productSchema);
```

Other models (Owner, SectionImage, etc.) follow similar principles.

## Technologies Used

- **React:** For building the user interface.
- **Node.js & Express:** For the RESTful API backend.
- **MongoDB & Mongoose:** For data storage and schema management.
- **JWT:** For secure token-based authentication.
- **Bcrypt:** For secure password hashing.
- **EJS:** Templating engine for server-side view rendering.

## License

This project is licensed under the [MIT License](LICENSE).




