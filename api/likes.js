const { kv } = require('@vercel/kv');
const cookie = require('cookie');

module.exports = async (req, res) => {
  const { blogPostId = '' } = req.query;

  if (req.method === 'POST') {
    try {
      const cookies = cookie.parse(req.headers.cookie || '');
      const userLikeKey = `${blogPostId}_${cookies.userId}`;

      // Check if the user has already liked the blog post
      const userLiked = await kv.get(userLikeKey);

      // Get the current like count from the key-value store
      let likeCount = parseInt(await kv.get(blogPostId)) || 0;

      if (userLiked) {
        // User has already liked the post, so unlike it
        await kv.delete(userLikeKey);
        likeCount--;
      } else {
        // User hasn't liked the post, so like it
        await kv.set(userLikeKey, 'liked');
        likeCount++;
      }

      // Update the like count in the key-value store
      await kv.set(blogPostId, likeCount);

      // Set the user ID cookie if it doesn't exist
      if (!cookies.userId) {
        const userId = Date.now().toString();
        res.setHeader('Set-Cookie', cookie.serialize('userId', userId, {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 365, // 1 year
          sameSite: 'strict',
          path: '/'
        }));
      }

      res.status(200).json({ likes: likeCount, liked: !userLiked });
    } catch (error) {
      console.error('Error updating like count:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'GET') {
    try {
      const cookies = cookie.parse(req.headers.cookie || '');
      const userLikeKey = `${blogPostId}_${cookies.userId}`;

      // Get the current like count from the key-value store
      const likeCount = parseInt(await kv.get(blogPostId)) || 0;

      // Check if the user has already liked the blog post
      const userLiked = await kv.get(userLikeKey);

      res.status(200).json({ likes: likeCount, liked: !!userLiked });
    } catch (error) {
      console.error('Error retrieving like count:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};