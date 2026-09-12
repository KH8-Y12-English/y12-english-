exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { html, sha } = JSON.parse(event.body);

    const response = await fetch(
      'https://api.github.com/repos/kh8-y12-english/y12-english-/contents/index.html',
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${process.env.GITHUB_PAT}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Netlify-Save-Function'
        },
        body: JSON.stringify({
          message: 'Update content via site editor',
          content: Buffer.from(html).toString('base64'),
          sha: sha,
          branch: 'main'
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { statusCode: response.status, body: JSON.stringify(data) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Saved successfully!' })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
