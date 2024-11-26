require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const router = express.Router();
const Destination = require('./models/Destination');
const List = require('./models/List');
const { ObjectId } = mongoose.Types;
const cors = require("cors")
const stringSimilarity = require('string-similarity');
const auth = require('./middleware/auth');
const { User } = require('./models/User');
const config = require('./config/config');

const userRoutes = require('./routes/users')
const authRoutes = require('./routes/auth')
const reviewsRoute = require('./routes/reviews')

// Define the field mapping
const fieldMapping = {
    name: "Destination",
    region: "Region",
    country: "Country",
    "all categories": "Destination"
};

// middlewares
app.use(express.json());
app.use(cors({
    origin: config.cors.origin
}));

// routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/lists', reviewsRoute);


// Serving frontend code
app.use('/', express.static('client'));
// Import environment variables
const MONGOURL = "mongodb+srv://vivekajayjariwala:LFGBlFaPukzISvHL@se3316cluster.v3rk4.mongodb.net/travel_data?retryWrites=true&w=majority&appName=se3316cluster"; 
const port = 3000;

// Establish connection to MongoDB database using mongoose 
mongoose.connect(MONGOURL);
const db = mongoose.connection;

db.on('error', (err) => {
    console.log(err);
});

db.once('open', () => {
    console.log('Database connection established!');
});


app.use('/api', router);

// Setup logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
});

// Input Sanitization Middleware
const sanitizeInputs = (req, res, next) => {
    try {
        // Sanitize parameters that should be ObjectId
        if (req.params.destination_id && !ObjectId.isValid(req.params.destination_id)) {
            return res.status(400).json({ message: 'Invalid destination ID format' });
        }
        if (req.params.listName) {
            req.params.listName = req.params.listName.trim();
        }
        
        // Sanitize inputs for list creation and updates
        if (req.body.listName) {
            req.body.listName = req.body.listName.trim();
        }
        if (req.body.destinations) {
            req.body.destinations = req.body.destinations.filter(id => ObjectId.isValid(id));
        }

        next();
    } catch (err) {
        console.error('Error during input sanitization:', err);
        res.status(500).send('Input sanitization error');
    }
};

// GET Request: get all available country names 
router.get('/destinations/countries', async (req, res, next) => {
    try {
        const destinationData = await Destination.find();
        const countries = Array.from(new Set(destinationData.map(dest => dest.Country))).sort();
        res.json({ countries });
    } catch (err) {
        next(err);
    }
});

// Apply sanitizeInputs middleware to all routes
router.use(sanitizeInputs);

// Centralized Error Handling Middleware
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
};

// GET Request: test  
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// GET Request: get all european destinations data 
router.get('/destinations/', async (req, res, next) => {
    try {
        const destinationData = await Destination.find();
        res.json(destinationData);
    } catch (err) {
        next(err);
    }
});

// GET Request: search for destinations by a specific pattern 
router.get('/destinations/search', async (req, res, next) => {
    let { field, pattern, limit, skip } = req.query;

    try {
        // Get all destinations first
        let destinations = await Destination.find();
        
        if (pattern && pattern.trim()) {
            const searchTerms = pattern.trim().toLowerCase().split(/\s+/);
            
            // Filter destinations based on Dice coefficient similarity
            destinations = destinations.filter(dest => {
                if (field === "all categories" || !field) {
                    // Check each search term against all fields
                    return searchTerms.every(term => {
                        const destName = dest.Destination.toLowerCase();
                        const country = dest.Country.toLowerCase();
                        const region = dest.Region.toLowerCase();
                        
                        // Use Dice coefficient for similarity
                        const nameSimilarity = stringSimilarity.compareTwoStrings(term, destName);
                        const countrySimilarity = stringSimilarity.compareTwoStrings(term, country);
                        const regionSimilarity = stringSimilarity.compareTwoStrings(term, region);
                        
                        // Consider a match if similarity is above 0.4 
                        const similarityThreshold = 0.3;
                        return Math.max(nameSimilarity, countrySimilarity, regionSimilarity) > similarityThreshold ||
                               destName.startsWith(term) || country.startsWith(term) || region.startsWith(term);
                    });
                } else {
                    // Search in specific field
                    field = fieldMapping[field.toLowerCase()] || field;
                    const fieldValue = dest[field].toLowerCase();
                    
                    return searchTerms.every(term => {
                        // Check for exact starts-with match first
                        if (fieldValue.startsWith(term)) {
                            return true;
                        }
                        
                        // Fall back to Dice coefficient similarity
                        const similarity = stringSimilarity.compareTwoStrings(term, fieldValue);
                        return similarity > 0.4; // Adjust threshold as needed
                    });
                }
            });

            // Sort results by similarity (highest first)
            destinations.sort((a, b) => {
                const aMaxSimilarity = Math.max(...searchTerms.map(term => 
                    stringSimilarity.compareTwoStrings(term, a.Destination.toLowerCase())
                ));
                const bMaxSimilarity = Math.max(...searchTerms.map(term => 
                    stringSimilarity.compareTwoStrings(term, b.Destination.toLowerCase())
                ));
                return bMaxSimilarity - aMaxSimilarity;
            });
        }
        
        // Get total count before pagination
        const total = destinations.length;
        
        // Apply pagination
        const resultsLimit = limit ? parseInt(limit, 10) : 5;
        const resultsSkip = skip ? parseInt(skip, 10) : 0;
        
        destinations = destinations.slice(resultsSkip, resultsSkip + resultsLimit);

        res.json({
            results: destinations,
            total: total
        });
    } catch (err) {
        next(err);
    }
});

// GET Request: get all details for a destination by ID   
router.get('/destinations/:destination_id', async (req, res, next) => {
    try {
        const destination = await Destination.findById(req.params.destination_id);
        if (!destination) {
            return res.status(404).json({ message: 'Destination not found' });
        }
        res.json(destination);
    } catch (err) {
        next(err);
    }
});

// GET Request: get coordinates for a destination by ID   
router.get('/destinations/:destination_id/coordinates', async (req, res, next) => {
    try {
        const destination = await Destination.findById(req.params.destination_id);
        if (!destination) {
            return res.status(404).json({ message: 'Destination not found' });
        }
        
        res.json({ 
            Latitude: destination.Latitude, 
            Longitude: destination.Longitude 
        });
    } catch (err) {
        next(err);
    }
});


// POST Request: create new custom list (protected route)
router.post('/lists', auth, async (req, res, next) => {
    const { listName, description, isPublic, destinations } = req.body;

    try {
        // Check for existing list with same name for this user
        const existingList = await List.findOne({ 
            listName, 
            userId: req.user._id 
        });
        
        if (existingList) {
            return res.status(400).json({ 
                message: 'You already have a list with this name' 
            });
        }

        const newList = new List({
            listName,
            description,
            isPublic: isPublic || false,
            userId: req.user._id,
            destinationIds: destinations
        });

        await newList.save();

        res.status(201).json({ 
            message: 'List created successfully', 
            list: newList 
        });
    } catch (err) {
        next(err);
    }
});

// PUT Request: update list (protected route)
router.put('/lists/:listName', auth, async (req, res, next) => {
    try {
        const list = await List.findOneAndUpdate(
            { 
                listName: req.params.listName,
                userId: req.user._id 
            },
            { 
                ...req.body,
                lastEdited: new Date()
            },
            { new: true }
        );
        
        if (!list) {
            return res.status(404).json({ 
                message: 'List not found or you do not have permission to modify it' 
            });
        }

        res.json({ 
            message: 'List updated successfully', 
            list 
        });
    } catch (err) {
        next(err);
    }
});

// GET Request: retrieve destination IDs from a specified list by list name
router.get('/lists/by-name/:listName', async (req, res) => {
    try {
        const list = await List.findOne({ listName: req.params.listName });
        if (!list) {
            return res.status(404).json({ message: 'List not found' });
        }
        res.json({ destinationIds: list.destinationIds });
    } catch (err) {
        next(err);
    }
});

// DELETE Request: delete a list (protected route)
router.delete('/lists/:listName', auth, async (req, res, next) => {
    try {
        const deletedList = await List.findOneAndDelete({ 
            listName: req.params.listName,
            userId: req.user._id
        });

        if (!deletedList) {
            return res.status(404).json({ 
                message: 'List not found or you do not have permission to delete it' 
            });
        }

        res.json({ message: 'List deleted successfully' });
    } catch (err) {
        next(err);
    }
});

// GET Request: retrieve destinations for a list
router.get('/lists/:listName/destinations', async (req, res, next) => {
    try {
        console.log('Fetching destinations for list:', req.params.listName);
        const list = await List.findOne({ listName: req.params.listName });
        
        if (!list) {
            console.log('List not found:', req.params.listName);
            return res.status(404).json({ message: 'List not found' });
        }

        console.log('Found list with destinations:', list.destinationIds);
        
        const destinations = await Destination.find({ 
            _id: { $in: list.destinationIds } 
        });
        
        console.log('Found destinations:', destinations.length);
        res.json(destinations);
    } catch (err) {
        console.error('Error fetching destinations:', err);
        next(err);
    }
});

// Define these routes BEFORE app.use('/api', router)
app.get('/api/lists/public', async (req, res) => {
    try {
        console.log('Accessing public lists endpoint');
        const lists = await List.find({ isPublic: true })
            .populate('userId', 'username')
            .populate('reviews.userId', 'username')
            .sort({ createdAt: -1 });

        console.log(`Found ${lists.length} public lists`);
        
        if (!lists.length) {
            return res.json([]); // Return empty array instead of 404
        }

        const sanitizedLists = lists.map(list => ({
            _id: list._id,
            listName: list.listName,
            description: list.description,
            userId: list.userId,
            destinationIds: list.destinationIds,
            createdAt: list.createdAt,
            reviews: list.reviews,
            averageRating: list.averageRating
        }));

        res.json(sanitizedLists);
    } catch (err) {
        console.error('Error in public lists endpoint:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Authenticated lists route
app.get('/api/lists', auth, async (req, res) => {
    try {
        console.log('Accessing authenticated lists endpoint');
        const lists = await List.find({
            $or: [
                { userId: req.user._id },
                { isPublic: true }
            ]
        })
        .populate('userId', 'username')
        .populate('reviews.userId', 'username')
        .sort({ createdAt: -1 });

        res.json(lists);
    } catch (err) {
        console.error('Error in authenticated lists endpoint:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST Request: add a review to a list
router.post('/lists/:listId/reviews', auth, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const list = await List.findById(req.params.listId);
        
        if (!list) {
            return res.status(404).json({ message: 'List not found' });
        }

        // Add the review
        list.reviews.push({
            userId: req.user._id,
            rating,
            comment
        });

        // Update average rating
        list.updateAverageRating();
        await list.save();

        res.json({ message: 'Review added successfully' });
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Attach error handler middleware after all routes
app.use(errorHandler);

// Listen on specified port
app.listen(config.server.port, () => {
    console.log(`Listening on port ${config.server.port}`);
});