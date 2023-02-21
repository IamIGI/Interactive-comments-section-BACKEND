"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const dbConnection_1 = __importDefault(require("./config/dbConnection"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const corsOptions_1 = __importDefault(require("./config/corsOptions"));
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
//Connect to MongoDB;
mongoose_1.default.set('strictQuery', false); //set strictQuery to false: allow to query fields that are not defined in your Mongoose schema.
(0, dbConnection_1.default)();
const app = (0, express_1.default)();
//CORS configuration
app.use((0, cors_1.default)(corsOptions_1.default));
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
//API_Routes
app.use('/comments', require('./routes/api/comments'));
// handle UNKNOWN URL REQUESTS
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('json')) {
        res.json({ error: '404: not found' });
    }
    else if (req.accepts('html')) {
        res.sendFile(path_1.default.join(__dirname, 'views', '404.html'));
    }
    else {
        res.type('txt').send('404: not found');
    }
});
mongoose_1.default.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
