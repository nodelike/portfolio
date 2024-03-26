const express = require('express');
const { sql } = require('@vercel/postgres');
const path = require('path');

const app = express();
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint for handling likes
app.post('/api/like/:blogPostId', async (req, res) => {
  const blogPostId = req.params.blogPostId;

  try {
    console.log('Retrieving current like count from the database...');
    const { rows } = await sql`
      SELECT like_count FROM blog_posts WHERE id = ${blogPostId}
    `;

    let currentLikeCount = 0;
    if (rows.length > 0) {
      currentLikeCount = rows[0].like_count;
    }

    console.log('Incrementing like count and updating the database...');
    const newLikeCount = currentLikeCount + 1;
    await sql`
      UPDATE blog_posts SET like_count = ${newLikeCount} WHERE id = ${blogPostId}
    `;

    console.log('Sending response with updated like count:', newLikeCount);
    res.json({ likeCount: newLikeCount });
  } catch (error) {
    console.error('Error updating like count:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Serve the index.html file for the root route
app.get('/', (req, res) => {
  try {
    console.log('Serving index.html file...');
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } catch (error) {
    console.error('Error serving index.html:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});