function updateLikeButton(liked) {
  const likeButton = document.getElementById('like');
  if (liked) {
    likeButton.classList.add('liked');
  } else {
    likeButton.classList.remove('liked');
  }
}

function likeBlogPost() {
  const urlParams = new URLSearchParams(window.location.search);
  const blogPostId = urlParams.get('file');

  fetch(`/api/likes?blogPostId=${encodeURIComponent(blogPostId)}`, { method: 'POST' })
    .then(response => response.json())
    .then(data => {
      const likeCountElement = document.querySelector('.likes span');
      likeCountElement.textContent = data.likes;
      updateLikeButton(data.liked);
    })
    .catch(error => {
      console.error('Error liking blog post:', error);
    });
}

function getBlogPostLikes() {
  const urlParams = new URLSearchParams(window.location.search);
  const blogPostId = urlParams.get('file');

  fetch(`/api/likes?blogPostId=${encodeURIComponent(blogPostId)}`)
    .then(response => response.json())
    .then(data => {
      const likeCountElement = document.querySelector('.likes span');
      likeCountElement.textContent = data.likes;
      updateLikeButton(data.liked);
    })
    .catch(error => {
      console.error('Error retrieving blog post likes:', error);
    });
}

function renderBlogPost() {
  return new Promise((resolve, reject) => {
    const blogPostElement = document.getElementById('blog-post');
    const urlParams = new URLSearchParams(window.location.search);
    const markdownFile = urlParams.get('file');

    if (markdownFile) {
      fetch(markdownFile)
        .then(response => response.text())
        .then(markdown => {
          const renderer = new marked.Renderer();
          let firstH1 = true;
          let firstH2 = true;

          renderer.heading = function (text, level) {
            if (level === 1 && firstH1) {
              firstH1 = false;

              const ogTitleElement = document.querySelector('meta[property="og:title"]');
              if (ogTitleElement) {
                ogTitleElement.setAttribute('content', text);
              };
              document.title = text
              return `<h1 id="blog-title">${text}</h1>`;
            } else if (level === 2 && firstH2) {
              firstH2 = false;
              return `<div class="blog-header"><h2 id="blog-date">${text}</h2><div id="likes" class="likes"><i id="like" class="fa-solid fa-heart"></i><span style="font-size: 16px;">0</span></div></div>`;
            }
            return `<h${level}>${text}</h${level}>`;
          };

          renderer.link = function (href, title, text) {
            const target = '_blank';
            const titleAttr = title ? ` title="${title}"` : '';
            return `<a href="${href}"${titleAttr} target="${target}">${text}</a>`;
          };

          const html = marked(markdown, { renderer });
          blogPostElement.innerHTML = html;
          resolve();
        })
        .catch(error => {
          console.error('Error fetching markdown file:', error);
          reject(error);
        });
    } else {
      resolve();
    }
  });
}

function loadPosts() {
  const postsFile = 'posts.json';
  const postsDiv = document.querySelector('.posts');

  fetch(postsFile)
    .then(response => response.json())
    .then(markdownFiles => {
      Promise.all(markdownFiles.map(file => fetch(file).then(response => response.text())))
        .then(markdownContents => {
          const posts = markdownContents.map((markdown, index) => {
            const renderer = new marked.Renderer();
            let title = '';
            let date = '';

            renderer.heading = function (text, level) {
              if (level === 1 && !title) {
                title = text;
              } else if (level === 2 && !date) {
                date = text;
              }
              return '';
            };

            marked(markdown, { renderer });
            const fileName = markdownFiles[index].split('/').pop();

            return {
              title: title,
              date: date,
              url: `posts/${fileName}`
            };
          });

          displayPosts(posts);
        });
    });
}

function displayPosts(posts) {
  const postsDiv = document.querySelector('.posts');
  postsDiv.innerHTML = '';

  posts.forEach(post => {
    const postElement = document.createElement('div');
    postElement.classList.add('post');
    postElement.setAttribute('onclick', `openBlog(this, '${post.url}')`);

    const titleElement = document.createElement('a');
    titleElement.classList.add('blog-title');
    titleElement.textContent = post.title;

    const dateElement = document.createElement('div');
    dateElement.classList.add('blog-date');
    dateElement.textContent = post.date;

    postElement.appendChild(titleElement);
    postElement.appendChild(dateElement);
    postsDiv.appendChild(postElement);
  });
}

function openBlog(element, link) {
  window.location.href = `blog.html?file=${link}`;
}

document.addEventListener("DOMContentLoaded", function () {
  renderBlogPost()
    .then(() => {
      getBlogPostLikes();
      const likesElement = document.getElementById('likes');
      if (likesElement) {
        likesElement.addEventListener('click', likeBlogPost);
      }
    })
    .catch(error => {
      console.error('Error rendering blog post:', error);
    });
});