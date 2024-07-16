document.addEventListener('DOMContentLoaded', () => {
  console.log('search.js');
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
      albumURL: `https://api.spotify.com/v1/search?q=${query}&type=album`,
      artistURL: `https://api.spotify.com/v1/search?q=${query}&type=artist`,
    };
  };

  const fetchSpotifyData = async (url, token) => {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch Spotify data');
    }
    return response.json();
  };

  const fetchAllSpotifyData = async (urls, token) => {
    const [trackData, playlistData, albumData, artistData] = await Promise.all([
      fetchSpotifyData(urls.trackURL, token),
      fetchSpotifyData(urls.playlistURL, token),
      fetchSpotifyData(urls.albumURL, token),
      fetchSpotifyData(urls.artistURL, token),
    ]);

    const trackItems = trackData.tracks.items;
    const playlistItems = playlistData.playlists.items;
    const albumItems = albumData.albums.items;
    const artistItems = artistData.artists.items;

    searchList = [
      ...trackItems,
      ...playlistItems,
      ...albumItems,
      ...artistItems,
    ];
    renderSearchResult();
    console.log('trackItems\n', trackItems);
    console.log('playlistItems\n', playlistItems);
    console.log('albumItems\n', albumItems);
    console.log('artistItems\n', artistItems);
  };

  const callSpotifyAPI = async (query) => {
    const CLIENT_ID = `904504b7562048308f3b78333a4cacd4`;
    const CLIENT_SECRET = `45da2b52af2d4752bbb7e828cb71cd18`;

    const token = await getAccessToken(CLIENT_ID, CLIENT_SECRET);
    const urls = getSpotifyURLs(query);
    await fetchAllSpotifyData(urls, token);
  };

  const renderSearchResult = () => {
    const section = document.getElementById('section');
    section.innerHTML = '';
    const div = document.createElement('div');
    div.classList.add('search-result', 'carousels');

    let trackHTML = '';
    let playlistHTML = '';
    let albumHTML = '';
    let artistHTML = '';

    searchList.forEach((item) => {
      if (item.type === 'track') {
        trackHTML += `
        <div class="search-track-list">
          <img src="${item.album.images[1].url}" alt="album_image" />
          <p>${item.name}</p>
          <p>${item.artists[0].name}</p>
        </div>
      `;
      } else if (item.type === 'playlist') {
        playlistHTML += `
        <div class="search-playlist-list">
          <img src="${item.images[0].url}" alt="playlist_image" />
          <h4>${item.name}</h4>
          <p>${item.owner.display_name}</p>
        </div>
      `;
      } else if (item.type === 'album') {
        albumHTML += `
        <div class="search-album-list">
          <img src="${item.images[1].url}" alt="album-img" />
          <p>${item.name}</p>
          <p>${item.album_type}</p>
          <p>${item.release_date}</p>
        </div>
      `;
      } else if (item.type === 'artist') {
        artistHTML += `
        <div class="search-artist-list">
          <img src="${item.images[1].url}" alt="artist_image" />
          <p>${item.name}</p>
          <p>${item.popularity}</p>
          <p>${item.genres[0]}</p>
        </div>
      `;
      }
    });

    if (trackHTML) {
      trackHTML = `
      <div class="carousel">
      <h1>Track</h1><div class="search-track">${trackHTML}</div><button class="carousel-button prev-button">Prev</button>
                <button class="carousel-button next-button">Next</button></div>`;
    }
    if (playlistHTML) {
      playlistHTML = `<div class="carousel"><h1>Playlist</h1><div class="search-playlist">${playlistHTML}</div><button class="carousel-button prev-button">Prev</button>
                <button class="carousel-button next-button">Next</button></div>`;
    }
    if (albumHTML) {
      albumHTML = `<div class="carousel"><h1>Album</h1><div class="search-album">${albumHTML}</div><button class="carousel-button prev-button">Prev</button>
                <button class="carousel-button next-button">Next</button></div>`;
    }
    if (artistHTML) {
      artistHTML = `<div class="carousel"><h1>Artist</h1><div class="search-artist">${artistHTML}</div><button class="carousel-button prev-button">Prev</button>
                <button class="carousel-button next-button">Next</button></div>`;
    }

    div.innerHTML = `${trackHTML}${albumHTML}${artistHTML}${playlistHTML}`;
    section.appendChild(div);
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
    searchInput.value = '';
  });
  searchBtn.addEventListener('click', () => {
    console.log('clicked!!');

    const searchElement = document.querySelector('.search');
    const currentDisplay = window.getComputedStyle(searchElement).display;

    if (currentDisplay === 'none') {
      searchElement.style.display = 'flex';
    }
  });
});
