const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 4000;  

const API_KEY = '5fa8e01f4a9546a081964bde0d4ccf91';

// Root route for input form
app.get('/', (req, res) => {
  res.send(`
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>News App</title>
        <style>
          html, body {
            height: 100%;
            margin: 0;
          }
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            box-sizing: border-box;
          }
          .container {
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 600px;
            text-align: center;
            box-sizing: border-box;
          }
          h1 {
            color: #333;
            margin-bottom: 20px;
          }
          form {
            display: flex;
            flex-direction: column;
            gap: 15px;
          }
          input[type="text"] {
            padding: 12px;
            font-size: 16px;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-sizing: border-box;
          }
          button {
            padding: 12px;
            background-color: #5c6bc0;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
          }
          button:hover {
            background-color: #3f51b5;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Search News Articles</h1>
          <form method="GET" action="/news">
            <input type="text" name="keyword" placeholder="Enter keyword (e.g., tech)" />
            <input type="text" name="country" placeholder="Enter country (e.g., us)" />
            <input type="text" name="category" placeholder="Enter category (e.g., business)" />
            <button type="submit">Search News</button>
          </form>
        </div>
      </body>
    </html>
  `);
});

// News route for displaying articles based on user input
app.get('/news', async (req, res) => {
  const { keyword, country, category } = req.query;

  let url = `https://newsapi.org/v2/top-headlines?apiKey=${API_KEY}`;

  if (keyword) url += `&q=${keyword}`;
  if (country) url += `&country=${country}`;
  if (category) url += `&category=${category}`;

  try {
    const response = await axios.get(url);
    const articles = response.data.articles.slice(0, 5);

    if (!articles.length) {
      res.send(`
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>No Results</title>
            <style>
              html, body {
                height: 100%;
                margin: 0;
              }
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f9;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 20px;
                box-sizing: border-box;
              }
              .container {
                background: #fff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                width: 100%;
                max-width: 600px;
                text-align: center;
                box-sizing: border-box;
              }
              h1 {
                color: #333;
                margin-bottom: 20px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>No News Found</h1>
              <p>Try again with different criteria.</p>
              <a href="/">Go Back</a>
            </div>
          </body>
        </html>
      `);
      return;
    }

    let output = `
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>News Results</title>
          <style>
            html, body {
              height: 100%;
              margin: 0;
              padding: 0;
            }
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f9;
              padding: 20px;
              min-height: 100vh;
              box-sizing: border-box;
            }
            .container {
              background: #fff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              width: 100%;
              max-width: 800px;
              margin: 0 auto;


              text-align: center;
              box-sizing: border-box;
            }
            h1 {
              color: #333;
              margin-bottom: 20px;
            }
            ul {
              list-style-type: none;
              padding: 0;
            }
            li {
              background: #fff;
              padding: 15px;
              margin-bottom: 15px;
              border-radius: 8px;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
              box-sizing: border-box;
            }
            h2 {
              color: #5c6bc0;
              font-size: 1.2em;
            }
            p {
              font-size: 1em;
              color: #666;
            }
            a {
              text-decoration: none;
              color: #3f51b5;
              font-weight: bold;
            }
            a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Latest News</h1>
            <ul>
    `;
    articles.forEach(article => {
      output += `
        <li>
          <h2>${article.title}</h2>
          <p>${article.description || 'No description available'}</p>
          <a href="${article.url}" target="_blank">Read more</a>
        </li>
      `;
    });

    output += `
      </ul>
      <a href="/">Search Again</a>
      </div>
    </body>
  </html>
  `;

    res.send(output);
  } catch (error) {
    console.error(error.message);
    res.send(`
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Error</title>
          <style>
            html, body {
              height: 100%;
              margin: 0;
            }
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f9;
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 20px;
            }
            .container {
              background: #fff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              width: 100%;
              max-width: 600px;
              text-align: center;
              box-sizing: border-box;
            }
            h1 {
              color: #333;
              margin-bottom: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Error Fetching News</h1>
            <p>Please try again later.</p>
            <a href="/">Go Back</a>
          </div>
        </body>
      </html>
    `);
  }
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
