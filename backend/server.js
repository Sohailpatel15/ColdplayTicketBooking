// const express = require('express');
// const redis = require('redis');
// const { v4: uuidv4 } = require('uuid');
// const cors = require('cors');
// const { WebSocketServer } = require('ws');

// const app = express();
// app.use(cors());

// // Redis setup
// const client = redis.createClient();
// client.on('error', (err) => console.error('Redis Client Error', err));
// client.connect();

// const QUEUE_NAME = 'coldplay_queue';
// const CHANNEL_NAME = 'queue_updates'; // Redis Pub/Sub channel
// const DEQUEUE_TIME = 3000; // 3 seconds

// // WebSocket server to broadcast updates
// const wss = new WebSocketServer({ port: 8080 });
// wss.on('connection', (ws) => {
//     console.log('Client connected via WebSocket');
// });

// // Broadcast queue updates to WebSocket clients
// function broadcast(message) {
//     wss.clients.forEach((client) => {
//         if (client.readyState === 1) {
//             client.send(JSON.stringify(message));
//         }
//     });
// }

// // Redis Pub/Sub subscription for real-time queue updates
// const subscriber = client.duplicate();
// subscriber.connect();
// subscriber.subscribe(CHANNEL_NAME, (message) => {
//     broadcast(JSON.parse(message));
// });

// // Function to handle dequeueing the first user
// const dequeueUser = async () => {
//     // Get the first user in the queue
//     const firstUser = await client.zRangeWithScores(QUEUE_NAME, 0, 0);

//     if (firstUser.length > 0) {
//         const { value: userId } = firstUser[0];

//         console.log(`Dequeueing user: ${userId}`);

//         // Dequeue the user after 3 seconds
//         setTimeout(async () => {
//             await client.zRem(QUEUE_NAME, userId);

//             // Notify clients of the updated queue
//             const updatedQueue = await client.zRangeWithScores(QUEUE_NAME, 0, -1);
//             await client.publish(CHANNEL_NAME, JSON.stringify(updatedQueue));

//             // Recursively call to dequeue the next user
//             dequeueUser();
//         }, DEQUEUE_TIME);
//     }
// };

// // Enqueue user and publish queue state
// app.post('/enqueue', async (req, res) => {
//     try {
//         const userId = uuidv4();
//         const position = await client.zCard(QUEUE_NAME) + 1; // Position based on queue size
//         await client.zAdd(QUEUE_NAME, { score: position, value: userId });

//         const queue = await client.zRangeWithScores(QUEUE_NAME, 0, -1);
//         await client.publish(CHANNEL_NAME, JSON.stringify(queue));

//         // Start the dequeue process if this is the first user in the queue
//         if (position === 1) {
//             dequeueUser();
//         }

//         res.json({ userId, position });
//     } catch (error) {
//         console.error('Enqueue error:', error);
//         res.status(500).json({ error: 'Failed to enqueue user' });
//     }
// });

// // Dequeue user, recalculate positions, and publish queue state
// app.post('/dequeue/:userId', async (req, res) => {
//     try {
//         const { userId } = req.params;
//         await client.zRem(QUEUE_NAME, userId);

//         // Recalculate the queue positions
//         const queue = await client.zRangeWithScores(QUEUE_NAME, 0, -1);
//         const updatedQueue = queue.map((item, index) => ({
//             value: item.value,
//             score: index + 1,
//         }));

//         // Update Redis with new positions
//         const multi = client.multi();
//         updatedQueue.forEach(({ value, score }) => {
//             multi.zAdd(QUEUE_NAME, { score, value });
//         });
//         await multi.exec();

//         // Publish the updated queue state
//         await client.publish(CHANNEL_NAME, JSON.stringify(updatedQueue));

//         res.json({ message: 'User removed from queue.' });
//     } catch (error) {
//         console.error('Dequeue error:', error);
//         res.status(500).json({ error: 'Failed to dequeue user' });
//     }
// });

// // Get user position
// app.get('/position/:userId', async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const userScore = await client.zScore(QUEUE_NAME, userId);

//         if (userScore !== null) {
//             const position = await client.zRank(QUEUE_NAME, userId) + 1;
//             res.json({ position });
//         } else {
//             res.json({ position: -1 }); // User not in queue
//         }
//     } catch (error) {
//         console.error('Position check error:', error);
//         res.status(500).json({ error: 'Failed to check position' });
//     }
// });

// // Reset queue and publish the reset state
// app.post('/reset-queue', async (req, res) => {
//     try {
//         await client.del(QUEUE_NAME);
//         await client.publish(CHANNEL_NAME, JSON.stringify([])); // Publish empty queue
//         res.json({ message: 'Queue reset successfully.' });
//     } catch (error) {
//         console.error('Reset error:', error);
//         res.status(500).json({ error: 'Failed to reset queue' });
//     }
// });

// app.listen(5000, () => console.log('Server running on http://localhost:5000'));



const express = require('express');
const redis = require('redis');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const { WebSocketServer } = require('ws');

const app = express();
app.use(cors());

const client = redis.createClient();
client.on('error', (err) => console.error('Redis Client Error', err));
client.connect();

const QUEUE_NAME = 'coldplay_queue';
const CHANNEL_NAME = 'queue_updates'; // Redis Pub/Sub channel
const DEQUEUE_TIME = 7000; // 3 seconds for seat selection

// WebSocket server to broadcast updates
const wss = new WebSocketServer({ port: 8080 });
wss.on('connection', (ws) => {
    console.log('Client connected via WebSocket');
});

// Broadcast queue updates to WebSocket clients
function broadcast(message) {
    wss.clients.forEach((client) => {
        if (client.readyState === 1) {
            client.send(JSON.stringify(message));
        }
    });
}

// Redis Pub/Sub subscription for real-time queue updates
const subscriber = client.duplicate();
subscriber.connect();
subscriber.subscribe(CHANNEL_NAME, (message) => {
    broadcast(JSON.parse(message));
});

// Function to handle dequeueing the first user
const dequeueUser = async () => {
    const firstUser = await client.zRangeWithScores(QUEUE_NAME, 0, 0);

    if (firstUser.length > 0) {
        const { value: userId } = firstUser[0];

        console.log(`Dequeueing user: ${userId}`);

        // Dequeue the user after 3 seconds for seat selection
        setTimeout(async () => {
            await client.zRem(QUEUE_NAME, userId);

            // Notify clients of the updated queue
            const updatedQueue = await client.zRangeWithScores(QUEUE_NAME, 0, -1);
            await client.publish(CHANNEL_NAME, JSON.stringify(updatedQueue));

            dequeueUser(); // Call to dequeue the next user
        }, DEQUEUE_TIME);
    }
};

// Enqueue user
app.post('/enqueue', async (req, res) => {
    try {
        const userId = uuidv4();
        const position = await client.zCard(QUEUE_NAME) + 1; 
        await client.zAdd(QUEUE_NAME, { score: position, value: userId });

        const queue = await client.zRangeWithScores(QUEUE_NAME, 0, -1);
        await client.publish(CHANNEL_NAME, JSON.stringify(queue));

        if (position === 1) {
            dequeueUser(); 
        }

        res.json({ userId, position });
    } catch (error) {
        console.error('Enqueue error:', error);
        res.status(500).json({ error: 'Failed to enqueue user' });
    }
});

// Handle seat selection and remove the user from the queue
app.post('/seat-selection/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        await client.zRem(QUEUE_NAME, userId);

        const updatedQueue = await client.zRangeWithScores(QUEUE_NAME, 0, -1);
        await client.publish(CHANNEL_NAME, JSON.stringify(updatedQueue));

        res.json({ message: 'Seat selected and user dequeued.' });
    } catch (error) {
        console.error('Seat selection error:', error);
        res.status(500).json({ error: 'Failed to process seat selection.' });
    }
});

// Reset queue
app.post('/reset-queue', async (req, res) => {
    try {
        await client.del(QUEUE_NAME);
        await client.publish(CHANNEL_NAME, JSON.stringify([]));
        res.json({ message: 'Queue reset successfully.' });
    } catch (error) {
        console.error('Reset error:', error);
        res.status(500).json({ error: 'Failed to reset queue.' });
    }
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
