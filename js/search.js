document.addEventListener('DOMContentLoaded', () => {
  let searchList = [];

  const searchBtn = document.querySelector('.weather-search-btn');
  const searchInput = document.querySelector('.search-input');

  const getAccessToken = async (CLIENT_ID, CLIENT_SECRET) => {
    const encodedCredentials = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

    const response = await fetch(`https://accounts.spotify.com/api/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${encodedCredentials}`,
      },
      body: 'grant_type=client_credentials',
    });

    const data = await response.json();
    return data.access_token;
  };

  const getSpotifyURLs = (query) => {
    return {
      trackURL: `https://api.spotify.com/v1/search?q=${query}&type=track`,
      playlistURL: `https://api.spotify.com/v1/search?q=${query}&type=playlist`,
    };
  };

  const fetchSpotifyData = async (urls, token) => {
    const responses = await Promise.all([
      fetch(urls.trackURL, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      fetch(urls.playlistURL, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    ]);

    const [trackResponse, playlistResponse] = await Promise.all(
      responses.map((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch Spotify data');
        }
        return response.json();
      })
    );

    const trackData = trackResponse.tracks.items;
    const playlistData = playlistResponse.playlists.items;

    totalResults =
      trackResponse.tracks.total + playlistResponse.playlists.total;
    searchList = [...trackData, ...playlistData];
    renderSearchResult();
    return { trackData, playlistData };
  };

  const callSpotifyAPI = async (query) => {
    const CLIENT_ID = `904504b7562048308f3b78333a4cacd4`;
    const CLIENT_SECRET = `45da2b52af2d4752bbb7e828cb71cd18`;

    const token = await getAccessToken(CLIENT_ID, CLIENT_SECRET);
    const urls = getSpotifyURLs(query);
    const data = await fetchSpotifyData(urls, token);
    return data;
  };

  const renderSearchResult = () => {
    const resultHTML = searchList
      .map((item) => {
        if (item.type === 'track') {
          return `
          <p>트랙: ${item.name}</p>
          <p>아티스트: ${item.artists[0].name}</p>
          <img src="${item.album.images[1].url}" alt="album_image" />
          `;
        } else if (item.type === 'playlist') {
          return `
          <p>플레이리스트: ${item.name}</p>
          <p>소유자: ${item.owner.display_name}</p>
          <img src="${item.images[0].url}" alt="playlist_image" />
          `;
        }
      })
      .join('');
    document.getElementById('section').innerHTML = resultHTML;
  };

  document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = searchInput.value;
    console.log(query);
    if (query) {
      await callSpotifyAPI(query);
    } else {
      console.error('Search query is empty');
    }
  });

  searchBtn.addEventListener('click', () => {
    console.log('clicked!!');
  });
});
