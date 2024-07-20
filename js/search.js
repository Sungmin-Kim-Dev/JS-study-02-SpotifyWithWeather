document.addEventListener('DOMContentLoaded', () => {
  console.log('search.js');
  let searchList = [];
  let trackCount = 0;

  const searchBtn = document.querySelector('.weather-search-btn');
  const searchInput = document.querySelector('.search-input');

  searchBtn.addEventListener('click', () => {
    const searchElement = document.querySelector('.search');
    searchElement.classList.toggle('search-active');
  });

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

  const createSearchPlaylistSection = () => {
    const section = document.querySelector('#section');

    section.innerHTML = '';

    const mainWeatherPlaylist = document.createElement('div');
    mainWeatherPlaylist.classList.add(
      'contents-container',
      'd-flex',
      'flex-column',
      'gap-4',
      'search-result'
    );

    const contentsLine = document.createElement('div');
    contentsLine.classList.add('contents-line');

    const weatherPlaylistHeader = document.createElement('div');
    weatherPlaylistHeader.classList.add(
      'contents-header',
      'search_playlist_header'
    );

    const headerTitle = document.createElement('h4');
    headerTitle.classList.add('contents-header-title', 'h4', 'text-white');
    headerTitle.innerHTML = `<h1>곡</h1>`;

    weatherPlaylistHeader.appendChild(headerTitle);

    const weatherPlaylistRow = document.createElement('div');
    weatherPlaylistRow.classList.add('card-container', 'search-track');

    contentsLine.appendChild(weatherPlaylistHeader);
    contentsLine.appendChild(weatherPlaylistRow);

    mainWeatherPlaylist.appendChild(contentsLine);
    section.appendChild(mainWeatherPlaylist);
  };

  const fetchAllSpotifyData = async (urls, token) => {
    createSearchPlaylistSection();
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
    const CLIENT_ID = config.clientID;
    const CLIENT_SECRET = config.clientSecret;

    const token = await getAccessToken(CLIENT_ID, CLIENT_SECRET);
    const urls = getSpotifyURLs(query);
    await fetchAllSpotifyData(urls, token);
  };

  // 밀리초를 분과 초로 변환하는 함수
  const formatDuration = (durationMs) => {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // 검색 결과 렌더링
  const renderSearchResult = () => {
    const section = document.getElementById('section');
    section.innerHTML = '';

    const createCategorySection = (title, htmlContent) => {
      const categoryContainer = document.createElement('div');
      categoryContainer.classList.add(
        'contents-container',
        'd-flex',
        'flex-column',
        'gap-4',
        'search-result'
      );

      const contentsLine = document.createElement('div');
      contentsLine.classList.add('contents-line');

      const playlistHeader = document.createElement('div');
      playlistHeader.classList.add('contents-header', 'search_playlist_header');

      const headerTitle = document.createElement('div');
      headerTitle.classList.add(
        'contents-header-title',
        'h4',
        'text-white',
        'search-result-header-text'
      );
      headerTitle.innerHTML = `<h1>${title}</h1><button class="contents-header-show-more search-row-more" onclick="showTwoLines(this)">더보기</button>`;

      playlistHeader.appendChild(headerTitle);

      const playlistRow = document.createElement('div');
      playlistRow.classList.add('card-container', 'search-track');
      playlistRow.innerHTML = htmlContent;

      contentsLine.appendChild(playlistHeader);
      contentsLine.appendChild(playlistRow);

      categoryContainer.appendChild(contentsLine);
      section.appendChild(categoryContainer);
    };

    let trackHTML = '';
    let playlistHTML = '';
    let albumHTML = '';
    let artistHTML = '';

    searchList.forEach((item) => {
      if (item.type === 'track') {
        if (trackCount >= 5) return;
        const duration = formatDuration(item.duration_ms);
        trackHTML += `
        <div class="contents-card search-playlist-item">
          <div class="card-img-box position-relative">
            <div class="card-img search-img">
              <img src="${item.album.images[1].url}" alt="album_image" />
            </div>
          </div>
          <div class="card-text search-track-list">
            <p>${
              item.name.length < 20
                ? item.name
                : item.name.substring(0, 20) + '...'
            }</p>
            <p>${
              item.artists[0].name.length < 10
                ? item.artists[0].name
                : item.artists[0].name.substring(0, 10) + '...'
            }</p>
            <p>${duration}</p>
          </div>
        </div>
      `;
        trackCount++;
      } else if (item.type === 'playlist') {
        playlistHTML += `
        <div class="contents-card search-playlist-item">
          <div class="card-img-box position-relative">
            <div class="card-img search-img">
              <img src="${item.images[0].url}" alt="playlist_image" />
            </div>
          </div>
          <div class="card-text search-playlist-list">
            <p>${
              item.name.length < 15
                ? item.name
                : item.name.substring(0, 15) + '...'
            }</p>
          </div>
        </div>
      `;
      } else if (item.type === 'album') {
        albumHTML += `
        <div class="contents-card search-playlist-item">
          <div class="card-img-box position-relative">
            <div class="card-img search-img">
              <img src="${item.images[1].url}" alt="album-img" />
            </div>
          </div>
          <div class="card-text search-album-list">
            <p>${
              item.name.length < 12
                ? item.name
                : item.name.substring(0, 12) + '...'
            }</p>
            <p class='search-album-tag'>${item.album_type}</p>
            <p>${item.release_date}</p>
          </div>
        </div>
      `;
      } else if (item.type === 'artist') {
        if (item.genres && item.genres[0]) {
          // 공백이 있는지 확인하고 'k-pop' 뒤의 부분을 제거하는 코드
          if (item.genres[0].includes(' ')) {
            item.genres[0] = item.genres[0].split(' ')[0];
          }
        }
        artistHTML += `
        <div class="contents-card search-playlist-item">
          <div class="card-img-box position-relative">
            <div class="card-img card-artist-img search-img">
              <img src="${item.images[1].url}" alt="artist_image" />
            </div>
          </div>
          <div class="card-text search-artist-list">
            <p>
              <span class="search-artist-rate">${item.name}<span>
              <span class="search-artist-rating">${item.popularity}</span>
            </p>
            <p class='search-genres-tag'>${
              item.genres[0] !== undefined || item.genres[0 !== null]
                ? item.genres[0]
                : '장르 분류 없음'
            }</p>
          </div>
        </div>
      `;
      }
    });

    if (trackHTML) createCategorySection('곡', trackHTML);
    if (albumHTML) createCategorySection('앨범', albumHTML);
    if (artistHTML) createCategorySection('아티스트', artistHTML);
    if (playlistHTML) createCategorySection('플레이리스트', playlistHTML);
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
});