// const ClientIDSKim = config.clientID;
// const ClientSecretSKim = config.clientSecret;
const ClientIDSKim = '411944574c3745f49a0ae819f629170b';
const ClientSecretSKim = '20eb343e234c4ec7ac730215cab938cc';
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
let spotifyBasicAPI = `https://api.spotify.com/v1/`;
let popularArtistsURL = `top/artists`;
// https://api.spotify.com/v1/browse/new-releases
let newReleaseURL = `browse/new-releases`;

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

const callContentsLine = async (url, HTML_ID) => {
  const contentsLine = document.getElementById(HTML_ID).closest('.contents-line');
  contentsLine.id = url;
  url = spotifyBasicAPI + url + `?limit=9`;
  const token = await getTokenSKim();
  let itemList = await fetchNewReleases(url, token);
  let albumList = itemList.albums.items;
  let renderHTML = renderCardLine(albumList);
  document.getElementById(HTML_ID).innerHTML = renderHTML;
};

callContentsLine(newReleaseURL, 'new-release-line');

const renderCardLine = (list) => {
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
  return cardItemHTML.join('');
};

const renderCardFull = async (clickedTitle) => {
  const contentsTitle = clickedTitle.closest('.contents-header-title').innerText;
  console.log(contentsTitle);
  const contentsLine = clickedTitle.closest('.contents-line');
  const apiURL = contentsLine.id;
  let url = spotifyBasicAPI + apiURL + `?limit=20`;
  const token = await getTokenSKim();
  let itemList = await fetchNewReleases(url, token);
  let albumList = itemList.albums.items;
  let prevHTML = `
    <div class="contents-line mt-5">
      <div class="contents-header">
        <a href="#" class="contents-header-title h2 text-white hover-none-underline">${contentsTitle}</a>
      </div>
      <div class="card-container">`;
  let renderHTML = renderCardLine(albumList);
  let closingHTML = `</div></div>`;
  document.getElementById('section').innerHTML = prevHTML + renderHTML + closingHTML;

  // 화면 전환 후 스타일 조정
  document.querySelector('.card-container').style.gridAutoRows = 'auto';
  let title = document.querySelector('.contents-header-title');
  title.style.cursor = 'text';
};
