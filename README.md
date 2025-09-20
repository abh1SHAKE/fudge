### Fudge allows users to browse and purchase sweets while providing administrators with comprehensive inventory management capabilities.

---

### Key features:

- User Authentication: Secure JWT-based authentication with registration and login
- Role-Based Access: Different permissions for regular users and administrators
- Sweet Management: Complete CRUD operations for sweet inventory
- Search & Filter: Advanced search functionality by name, category, and price range
- Inventory Control: Purchase tracking and admin restocking capabilities

---

### Technology stack:

- **Backend**:
  - Runtime: Node.js with TypeScript
  - Framework: Express.js
  - Database: MongoDB with Mongoose ODM
  - Authentication: JWT (JSON Web Tokens)
  - Security: bcryptjs, CORS
  - Validation: Built-in Mongoose validation

- **Frontend**:
  - Framework: React with TypeScript
  - Build Tool: Vite
  - Styling: Tailwind CSS with custom colors
  - Routing: React Router DOM
  - HTTP Client: Axios
  - Notifications: React Hot Toast

---

### Setup:

**Backend setup**:
```
# Clone the repository
git clone <repository-url>

# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Configure env file**:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sweet-shop
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

**Frontend setup**:
```
# Navigate to frontend directory (open a new terminal)
cd frontend

# Install dependencies
npm install

# Create environment file
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start the development server
npm run dev
```

---

### My AI Usage:
Throughout the development process, I leveraged AI tools to enhance productivity and code quality while maintaining full control over the architecture and implementation decisions.
I assisted me in areas including:

- Code scaffolding: Helped structure frontend components, service modules, and context/hooks.
- Type definitions: Assisted in creating consistent TypeScript interfaces and type safety across the project.
- Testing support: Generated sample payloads for testing API routes in Postman.
- Error handling guidance: Suggested patterns for centralized error management in the backend.
- General development assistance: Provided suggestions, code snippets, and boilerplate while maintaining full control over final implementation.

**AI Co-authorship in Commits**
I maintained transparency about AI usage through commit messages using the co-author format **might've missed a commit or two :)**

example:
```
add centralized error handler for Express

Handles ObjectId cast errors, duplicate keys, and validation errors in a unified way.

Co-authored-by: ChatGPT <chatgpt@bot.net>
```


