const albumClientId = 'ace01b2284a04c6c9e4f4f33ba2c1753';
const albumClientSecret = '02a7ba93648946e199c408d64181eb4c';
let clickedNameAlbum;

// 토큰 설정
const albumGetAccessToken = async (albumClientId, albumClientSecret) => {
    const encodedCredentials = btoa(`${albumClientId}:${albumClientSecret}`);
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

// 아티스트 이름으로 앨범 검색
const searchAlbums = async (artistName, accessToken) => {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=album`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    const data = await response.json();
    return data.albums.items;
};

// 앨범 정보 가져오기
const getAlbumInfo = async (albumId, accessToken) => {
    const response = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    const data = await response.json();
    return data;
};

// DOM 업데이트 함수
const updateAlbumsInDom = (albumInfo, albums) => {
    if (!albumInfo || !albums || albums.length === 0) {
        console.error('유효한 앨범 데이터가 없습니다.');
        return;
    }

    const container = document.getElementById('section');
    container.innerHTML = ''; // 기존 콘텐츠 지우기

    const album = albumInfo; // 첫 번째 앨범 정보

    if (!album || !album.images || !album.artists || !album.release_date) {
        console.error('앨범 데이터가 유효하지 않습니다.');
        return;
    }

    const totalDurationMs = album.tracks && album.tracks.items
        ? album.tracks.items.reduce((acc, track) => acc + track.duration_ms, 0)
        : 0;
    const totalDurationMin = Math.floor(totalDurationMs / 60000);
    const totalDurationSec = Math.floor((totalDurationMs % 60000) / 1000);

    const albumHTML = `
        <div class="album-info mb-4 d-flex">
            <img src="${album.images[0]?.url || 'img/random_img.jpg'}" alt="Album Cover" class="img-fluid" style="max-width: 200px" />
            <div class="album_details ms-3">
                <p>앨범</p>
                <h3 id="albumName">${album.name}</h3>
                <div class="album_info_grid">
                    <span class="album_artist_img">
                        <img id="albumArtistImage" src="${album.images[0]?.url || 'img/random_img.jpg'}" alt="">
                    </span>
                    <span id="albumArtistName" class="album_artist_name">
                        <a href="#">${album.artists.map(artist => artist.name).join(', ')}</a>
                    </span>
                    <span id="albumReleaseYear" class="album_release_year">
                        ${new Date(album.release_date).getFullYear()}
                    </span>
                    <span id="albumTotalPlayInfo" class="album_total_play_info">
                        ${album.total_tracks}곡, ${totalDurationMin}분 ${totalDurationSec}초
                    </span>
                </div>
            </div>
        </div>
        <div class="album_active_button_box">
            <div class="album_left_button_box">
                <div class="album_play_button">
                    <button class="album_play_icon">
                        <!-- 플레이버튼 영역 -->
                    </button>
                </div>
                <div class="album_heart_button">
                    <button class="album_heart_icon album_left_button_color">
                        <i class="fa-regular fa-heart album_fa-heart"></i>
                    </button>
                </div>
                <div class="album_option_button">
                    <button class="album_option_icon album_left_button_color">
                        <i class="fa-solid fa-ellipsis album_fa-ellipsis"></i>
                    </button>
                </div>
            </div>
            <div class="album_list_view_box">
                <button class="album_list_button">
                    <span class="album_list_color">목록</span>
                    <i class="fa-solid fa-list album_fa-list album_list_color"></i>
                </button>
            </div>
        </div>
        <div class="album_track_title_box">
            <div class="album_track_title_num">
                #
            </div>
            <div class="album_track_title_empty"></div>
            <div class="album_track_title_text">
                제목
            </div>
            <div class="album_track_title_empty"></div>
            <div class="album_track_title_time">
                <i class="fa-regular fa-clock"></i>
            </div>
        </div>
        <div class="album_track_list_box">
            ${album.tracks && album.tracks.items ? album.tracks.items.map((track, index) => `
                <div class="album_track">
                    <div class="album_track_num">
                        <span class="album_track_num_txt">${index + 1}</span>
                        <button class="album_track_num_icon">
                            <i class="fa-solid fa-play album_track_fa-play"></i>
                        </button>
                    </div>
                    <div class="album_track_empty"></div>
                    <div class="album_track_info">
                        <span class="album_track_title">
                            <a href="${track.external_urls.spotify}">${track.name}</a>
                        </span>
                        <span class="album_track_artists">
                            ${track.artists.map(artist => 
                                `<a href="${artist.external_urls.spotify}">${artist.name}</a>`
                            ).join(' ')} <!-- 여기서 각 a 요소를 쉼표로 구분 -->
                        </span>
                    </div>
                    <div class="album_track_empty"></div>
                    <div class="album_track_time_box">
                        <button class="album_track_heart_icon">
                            <i class="fa-regular fa-heart album_track_fa-heart album_track_icon_color"></i>
                        </button>
                        <div class="album_track_time">
                            ${Math.floor(track.duration_ms / 60000)}:${Math.floor((track.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')}
                        </div>
                        <button class="album_track_option_icon">
                            <i class="fa-solid fa-ellipsis album_track_fa-ellipsis album_track_icon_color"></i>
                        </button>
                    </div>
                </div>
            `).join('') : '트랙 정보가 없습니다.'}
        </div>
        <div class="album_more_song">
            <div class="contents-line">
                <div class="contents-header">
                    <a href="#" id="AlbumMoreSongArtist" class="contents-header-title h4 text-white">${album.artists[0].name}의 곡 더 보기</a>
                    <button class="contents-header-show-more" onclick="showTwoLines()">더 보기</button>
                </div>
                <div class="card-container">
                    ${albums.slice(1, 10).map(album => `
                        <div class="contents-card">
                            <div class="card-img-box position-relative">
                                <div class="card-play-btn"></div>
                                <div class="card-img">
                                    <img src="${album.images[0]?.url || 'img/random_img.jpg'}" alt="${album.name}">
                                </div>
                            </div>
                            <div class="card-text">
                                <p class="card-title">${album.name}</p>
                                <p class="card-subtitle">${new Date(album.release_date).getFullYear()} - ${album.album_type}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    container.innerHTML = albumHTML;
};

// Spotify API 호출
const albumCallSpotifyApi = async () => {
    try {
        const accessToken = await albumGetAccessToken(albumClientId, albumClientSecret);
        const albums = await searchAlbums(clickedNameAlbum, accessToken);
        console.log('검색된 앨범 데이터:', albums); // 검색된 앨범 데이터 확인
        if (albums.length > 0) {
            const firstAlbumId = albums[0].id;
            const albumInfo = await getAlbumInfo(firstAlbumId, accessToken);
            console.log('첫 번째 앨범 정보:', albumInfo); // 첫 번째 앨범 정보 확인
            updateAlbumsInDom(albumInfo, albums);
        } else {
            console.log('해당 이름의 앨범을 찾을 수 없습니다:', clickedNameAlbum);
        }
    } catch (error) {
        console.error('앨범 정보를 가져오는 중 오류 발생:', error);
    }
};

// 아티스트 이름 가져오기 / 클릭 이벤트 설정
document.addEventListener('DOMContentLoaded', () => {
    const artistText = document.querySelectorAll('.card-subtitle-artist');
    artistText.forEach((name) => {
        name.addEventListener('click', (event) => {
            clickedNameAlbum = event.target.innerText.toLocaleLowerCase();
            console.log('클릭된 아티스트 이름:', clickedNameAlbum);
            albumCallSpotifyApi();
        });
    });
});
