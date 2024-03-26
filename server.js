const express = require('express');
const { sql } = require('@vercel/postgres');

const app = express();
app.use(express.json());

// API endpoint for handling likes
app.post('/api/like/:blogPostId', async (req, res) => {
  const blogPostId = req.params.blogPostId;

  try {
    // Retrieve the current like count from the database
    const { rows } = await sql`
      SELECT like_count FROM blog_posts WHERE id = ${blogPostId}
    `;

    let currentLikeCount = 0;
    if (rows.length > 0) {
      currentLikeCount = rows[0].like_count;
    }

    // Increment the like count and update the database
    const newLikeCount = currentLikeCount + 1;
    await sql`
      UPDATE blog_posts SET like_count = ${newLikeCount} WHERE id = ${blogPostId}
    `;

    res.json({ likeCount: newLikeCount });
  } catch (error) {
    console.error('Error updating like count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});