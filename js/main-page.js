const ClientIDSKim = config.clientID;
const ClientSecretSKim = config.clientSecret;
const artistAPI = `https://api.spotify.com/v1/artists/`;

const getTokenSKim = async () => {
  const encoded_Credentials = btoa(`${ClientIDSKim}:${ClientSecretSKim}`);
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body: new URLSearchParams({
      grant_type: 'client_credentials',
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${encoded_Credentials}`,
    },
  });
  // console.log(response);
  const data = await response.json();
  // console.log(data.access_token);
  return data.access_token;
};

// https://open.spotify.com/section/0JQ5DAnM3wGh0gz1MXnu3C
let popularArtistsURL = `https://api.spotify.com/v1/top/artists`;
// https://api.spotify.com/v1/browse/new-releases
let newReleaseURL = `https://api.spotify.com/v1/browse/new-releases`;

const fetchNewReleases = async (url, token) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url} data`);
  }
  const data = await response.json();
  console.log(data);
  return data;
};

const callAlbumLine = async (url, HTML_ID) => {
  url = url + `?limit=9`
  const token = await getTokenSKim();
  let itemList = await fetchNewReleases(url, token);
  let albumList = itemList.albums.items;
  renderCardLine(albumList, HTML_ID);
};

callAlbumLine(newReleaseURL, 'new-release-line');

const renderCardLine = (list, HTML_ID) => {
  let cardItemHTML = list.map((album) => {
    return `<div class="contents-card">
      <div class="card-img-box position-relative">
        <div class="card-play-btn"></div>
        <div class="card-img">
          <img src="${album.images[0].url}" alt="">
        </div>
      </div>
      <div class="card-text">
        <p class="card-title">${album.name}</p>
        <p class="card-subtitle card-subtitle-artist">${album.artists[0].name}</p>
      </div>
    </div>`;
  });
  document.getElementById(HTML_ID).innerHTML = cardItemHTML.join('');
};


