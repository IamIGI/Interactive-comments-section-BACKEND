import allowedOrigins from './allowedOrigins';

const corsOptions = {
    // @ts-ignore - to ignore typescript warnings
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true); //send true when origin url in the whitelist
        } else {
            callback(new Error('not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200,
};

export default corsOptions;
