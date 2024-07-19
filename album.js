const CLIENT_ID = 'ace01b2284a04c6c9e4f4f33ba2c1753';
const CLIENT_SECRET = '02a7ba93648946e199c408d64181eb4c';
let clickedName = "에스파"; // 검색할 아티스트 이름

// 토큰 설정
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
const updateAlbumsInDOM = (albums) => {
    const container = document.querySelector('.card-container');
    container.innerHTML = '';

    albums.forEach((album, index) => {
        const albumHTML = document.createElement('div');
        albumHTML.className = 'contents-card';
        albumHTML.innerHTML = `
            <div class="card-img-box position-relative">
                <div class="card-play-btn"></div>
                <div class="card-img">
                    <img src="${album.images[0].url}" alt="${album.name}" onerror="this.onerror=null; this.src='https://via.placeholder.com/150';">
                </div>
            </div>
            <div class="card-text">
                <p class="card-title">${album.name}</p>
                <p class="card-subtitle">${new Date(album.release_date).getFullYear()} - Album</p>
            </div>
        `;
        container.appendChild(albumHTML); // 새 앨범 카드 추가
    });
};

// HTML 업데이트 함수
const updateAlbumInfo = (album) => {
    document.querySelector('.album_details h3').textContent = album.name;
    document.getElementById('albumArtistImage').src = album.images[0].url;
    document.querySelector('.album_artist_name').innerHTML = album.artists.map(artist => artist.name).join(', ');
    document.querySelector('.album_release_year').textContent = new Date(album.release_date).getFullYear();

    // 총 재생 시간
    const totalDurationMs = album.tracks.items.reduce((acc, track) => acc + track.duration_ms, 0);
    const totalDurationMin = Math.floor(totalDurationMs / 60000);
    const totalDurationSec = Math.floor((totalDurationMs % 60000) / 1000);
    document.querySelector('.album_total_play_info').textContent = `${album.total_tracks}곡, ${totalDurationMin}분 ${totalDurationSec}초`;

    // 이미지 설정
    const albumCoverImage = album.images[0] ? album.images[0].url : 'default_album_image.jpg';
    document.querySelector('.album-info img').src = albumCoverImage;

    // 트랙 리스트 업데이트
    const trackList = document.querySelector('.album_track_list_box');
    trackList.innerHTML = '';

    album.tracks.items.forEach((track, index) => {
        const trackElement = document.createElement('div');
        trackElement.classList.add('album_track');
        
        trackElement.innerHTML = `
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
            <span class="album_track_artist">
              <a href="${track.artists[0].external_urls.spotify}">${track.artists[0].name}</a>
            </span>
          </div>
          <div class="album_track_empty"></div>
          <div class="album_track_time_box">
            <button class="album_track_heart_icon">
              <i class="fa-regular fa-heart album_track_fa-heart"></i>
            </button>
            <div class="album_track_time">
              ${Math.floor(track.duration_ms / 60000)}:${Math.floor((track.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')}
            </div>
            <button class="album_track_option_icon">
              <i class="fa-solid fa-ellipsis album_track_fa-ellipsis"></i>
            </button>
          </div>
        `;
        trackList.appendChild(trackElement);
    });
};

// 메인 함수
const main = async () => {
    try {
        const accessToken = await getAccessToken(CLIENT_ID, CLIENT_SECRET);
        const albums = await searchAlbums(clickedName, accessToken);
        if (albums.length > 0) {
            updateAlbumsInDOM(albums); // 앨범 목록을 업데이트
            const firstAlbumId = albums[0].id;
            const albumInfo = await getAlbumInfo(firstAlbumId, accessToken);
            console.log('Album Info:', albumInfo);
            updateAlbumInfo(albumInfo);
        } else {
            console.log('해당 이름의 앨범을 찾을 수 없습니다:', clickedName);
        }
    } catch (error) {
        console.error('Error fetching album info:', error);
    }
};

// 메인 함수 실행
document.addEventListener('DOMContentLoaded', main);


