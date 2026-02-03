# 🔮 Magical Wellness Challenge

A beautiful, magical-themed wellness challenge application with gamification features.

## 🚀 Quick Start

### Option 1: Use the Startup Script (Recommended)
1. Double-click `start-backend.bat` in the root directory
2. Open `frontend/index.html` in your web browser
3. Use test account: `test@lol.com` / `1234`

### Option 2: Manual Setup
1. Open terminal and navigate to the backend folder:
   ```bash
   cd backend
   npm install  # Only needed first time
   npm run dev
   ```
2. Open `frontend/index.html` in your web browser

## 🧪 Testing

### Test Backend Connection
- Open `frontend/test-backend.html` to test if the backend is working

### Test Frontend Functions
- Open `frontend/test-dashboard.html` to test dashboard functions without backend

### Test Full Application
1. Start backend server
2. Open `frontend/index.html`
3. Register a new account or use test account: `test@lol.com` / `1234`

## 🎯 Features

- **🔐 Authentication**: Login/Register with JWT tokens
- **🎯 Challenge System**: Create and complete wellness challenges
- **🏆 Gamification**: Points, levels, and magical rewards
- **🛒 Magical Shop**: Purchase spells, ingredients, and resources
- **📊 Progress Tracking**: Monitor your wellness journey
- **✨ Beautiful UI**: Magical theme with gradients and animations

## 🔧 Technical Stack

### Backend
- **Node.js** with Express
- **MySQL** database
- **JWT** authentication
- **Bcrypt** password hashing
- **CORS** enabled

### Frontend
- **Vanilla JavaScript** (no frameworks)
- **CSS3** with custom magical theme
- **Responsive design**
- **Modular architecture**

## 📁 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth & validation
│   │   ├── models/         # Database models
│   │   └── services/       # Database connection
│   ├── package.json
│   └── .env               # Environment variables
├── frontend/
│   ├── css/               # Stylesheets
│   ├── js/
│   │   ├── utils/         # Utility functions
│   │   ├── services/      # API service
│   │   └── *.js          # Page scripts
│   ├── tests/            # Test files
│   ├── index.html        # Login page
│   ├── register.html     # Registration page
│   ├── dashboard.html    # Main dashboard
│   ├── test-backend.html # Backend testing
│   └── test-dashboard.html # Frontend testing
└── start-backend.bat     # Windows startup script
```

## 🐛 Troubleshooting

### Backend Issues

**❌ "npm run dev" not working**
- Make sure you're in the `backend` directory
- Run `npm install` first if you haven't

**❌ Server starts but exits immediately**
- Check if MySQL is running (if using local database)
- Check the `.env` file in backend folder

**❌ Database connection errors**
- Update database credentials in `backend/.env`
- Make sure MySQL server is running

### Frontend Issues

**❌ Buttons not working**
- Make sure backend server is running on port 3000
- Check browser console for JavaScript errors
- Try the test pages first

**❌ Login not working**
- Test backend connection with `test-backend.html`
- Create a new account if test account doesn't exist
- Check network tab in browser dev tools

**❌ CORS errors**
- Backend has CORS enabled
- Make sure you're not opening files directly (use a local server)

## 🎮 Test Accounts

- **Email**: test@lol.com
- **Password**: 1234

## 🌟 API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/register` - User registration
- `POST /api/refresh` - Refresh token

### Challenges
- `GET /api/challenges` - Get all challenges
- `POST /api/challenges` - Create new challenge
- `PUT /api/challenges/:id` - Update challenge
- `DELETE /api/challenges/:id` - Delete challenge

### Gamification
- `GET /api/spells` - Get all spells
- `GET /api/ingredients` - Get all ingredients
- `GET /api/resources` - Get all resources
- `GET /api/user-resources/:userId` - Get user's resources

## 🔮 Magic Features

- **Magical Theme**: Beautiful gradients and mystical colors
- **Responsive Design**: Works on desktop and mobile
- **Real-time Notifications**: Success/error messages with animations
- **Gamification**: Points, levels, and magical rewards
- **Progress Tracking**: Visual progress bars and statistics
- **Modal System**: Beautiful popup modals for interactions

## 📝 Development Notes

- Frontend uses vanilla JavaScript for maximum compatibility
- Modular architecture with separate utility files
- Error handling with user-friendly messages
- Token-based authentication with refresh tokens
- Responsive design with mobile-first approach

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for educational purposes.

---

**Happy Coding! 🔮✨**