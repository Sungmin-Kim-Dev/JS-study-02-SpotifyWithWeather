document.addEventListener('DOMContentLoaded', () => {
  console.log('weather.js');
  let url;

  let weatherMenuIcon = document.querySelector('.weather-menu-btn');
  console.log(weatherMenuIcon);

  const showWeatherIcon = (weather) => {
    switch (weather) {
      case 'Clear':
        weatherMenuIcon.innerHTML = `<i class="fa-solid fa-sun"></i> 날씨 추천곡`;
        return weatherMenuIcon;
      case 'Rain':
        weatherMenuIcon.innerHTML = `<i class="fa-solid fa-umbrella"></i> 날씨 추천곡`;
        return weatherMenuIcon;
      case 'Snow':
        weatherMenuIcon.innerHTML = `<i class="fa-solid fa-snowflake"></i> 날씨 추천곡`;
        return weatherMenuIcon;
      case 'Clouds':
        weatherMenuIcon.innerHTML = `<i class="fa-solid fa-cloud"></i> 날씨 추천곡`;
        return weatherMenuIcon;
      case 'Thunderstorm':
        weatherMenuIcon.innerHTML = `<i class="fa-solid fa-bolt"></i> 날씨 추천곡`;
        return weatherMenuIcon;
      default:
        weatherMenuIcon.innerHTML = `<i class="fa-solid fa-sun"></i> 날씨 추천곡`;
        return weatherMenuIcon;
    }
  };

  const getWeatherIcon = async () => {
    try {
      const WEATHER_API_KEY = `d4b800defbe4f3b28364a3642039beed`;

      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      let lat = position.coords.latitude;
      let lon = position.coords.longitude;

      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=us&appid=${WEATHER_API_KEY}`;
      // // url = `https://api.openweathermap.org/data/2.5/weather?q=california&units=metric&lang=us&appid=${WEATHER_API_KEY}`;

      // url = './data/current.weather.json';

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      // console.log(data);

      const weatherName = data.weather[0].main;
      // const weatherName = 'Clear';
      showWeatherIcon(weatherName);
      console.log(weatherName);
      await callSpotifyAPI(weatherName);
    } catch (error) {
      console.log('Error Message >> ', error);
    }
  };

  getWeatherIcon();

  const getWeatherInfo = async () => {
    const spinner = document.querySelector('#weather-spinner');
    if (spinner) {
      spinner.style.display = 'block';
    }
    try {
      const WEATHER_API_KEY = `d4b800defbe4f3b28364a3642039beed`;

      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      let lat = position.coords.latitude;
      let lon = position.coords.longitude;

      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=us&appid=${WEATHER_API_KEY}`;
      // url = `https://api.openweathermap.org/data/2.5/weather?q=california&units=metric&lang=us&appid=${WEATHER_API_KEY}`;

      // url = './data/current.weather.json';

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      // console.log(data);

      renderHTML(data);
      const weatherDescription = matchWeather(data.weather[0].main);

      console.log(data.weather[0].main);

      await callSpotifyAPI(weatherDescription);
      // console.log('Weather Description:', weatherDescription);
    } catch (error) {
      console.log('Error Message >> ', error);
    } finally {
      if (spinner) {
        spinner.style.display = 'none'; // 로딩 스피너 숨김
      }
    }
  };

  const renderHTML = (data) => {
    const nav = document.querySelector('#nav');
    // 기존 섹션을 지웁니다.
    const existingSection = nav.querySelector('.weather-display');
    if (existingSection) {
      nav.removeChild(existingSection);
    }

    const section = document.createElement('section');
    section.classList.add('weather-display');
    section.innerHTML = `
    <div class='weather-display'>
      <img src="https://openweathermap.org/img/wn/${
        data.weather[0].icon
      }@2x.png" alt="weather_Icon" />
      <div class='weather-current'>${data.weather[0].main}</div>
      <p class='weather-temp'>${data.main.temp.toFixed(1)}°</p>
      <p class='weather-location'>${data.name}</p>
    </div>
    `;
    nav.appendChild(section);
  };

  const renderPlaylists = (playlists) => {
    const section = document.querySelector('section#section');
    section.innerHTML = '<div class="row weather-row"></div>';
    const row = section.querySelector('.row');
    playlists.forEach((playlist) => {
      const col = document.createElement('div');
      col.classList.add(
        'col-lg-3',
        'col-md-4',
        'col-sm-6',
        'col-12',
        'playlist-item'
      );
      col.innerHTML = `
        <div class="card weather-card mb-4">
          <img src="${playlist.images[0].url}" class="card-img-top" alt="${playlist.name}" />
          <div class="card-body">
            <h5 class="card-title">${playlist.name}</h5>
            <p class="card-text">${playlist.description}</p>
            <a href="${playlist.external_urls.spotify}" class="weather-playlist-more" target="_blank">플레이리스트 보기</a>
          </div>
        </div>
      `;
      row.appendChild(col);
    });
  };

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

  const fetchTrackFeatures = async (trackId, token) => {
    const url = `https://api.spotify.com/v1/audio-features/${trackId}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch track features');
    }

    return response.json();
  };

  const callSpotifyAPI = async (weatherDescription) => {
    const CLIENT_ID = `904504b7562048308f3b78333a4cacd4`;
    const CLIENT_SECRET = `45da2b52af2d4752bbb7e828cb71cd18`;

    const token = await getAccessToken(CLIENT_ID, CLIENT_SECRET);
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${weatherDescription}&type=playlist`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch Spotify data');
    }

    const spotifyData = await response.json();
    // console.log('Playlists:', spotifyData.playlists.items);

    if (spotifyData.playlists.items.length === 0) {
      throw new Error('No playlists found');
    }

    renderPlaylists(spotifyData.playlists.items);

    // console.log('Spotify query:', weatherDescription);
  };

  const loadMusic = async (tracks, token, weatherDescription) => {
    try {
      const musicInfo = await Promise.all(
        tracks.map(async (track) => {
          const features = await fetchTrackFeatures(track.id, token);
          let musicDescription = {
            id: track.id,
            releaseDate: track.album.release_date,
            songName: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            albumCover: track.album.images[2].url,
            playMusic: track.preview_url,
            danceability: features.danceability,
            energy: features.energy,
            tempo: features.tempo,
            valence: features.valence,
            mood: [weatherDescription],
          };

          return matchWeatherWithSong(musicDescription);
        })
      );

      return musicInfo;
    } catch (error) {
      console.log('Error loading music:', error);
    }
  };

  const matchWeather = (weather) => {
    switch (weather) {
      case 'Clear':
        return '화창한 날';
      case 'Clouds':
        return '비온 후/ 맑게 갠';
      case 'Snow':
        return '눈오는 날';
      case 'Rain':
        return '비/ 흐림';
      default:
    }
  };

  const matchWeatherWithSong = (eachInfo) => {
    const weather = eachInfo.mood[0];
    if (weather === '화창한 날') {
      if (
        0.55 < eachInfo.valence &&
        70 < eachInfo.tempo &&
        eachInfo.tempo < 130
      ) {
        eachInfo.mood.push(
          '화창한 날',
          'sunny clear',
          '밝은 날',
          'bright day',
          '명랑한 날',
          'cheerful day',
          '행복한 햇살',
          'happy sunshine',
          '빛나는 날',
          'radiant day'
        );
      }
    } else if (weather === '비온 후/ 맑게 갠') {
      if (
        (0.7 < eachInfo.danceability &&
          eachInfo.danceability < 0.85 &&
          0.5 < eachInfo.energy &&
          eachInfo.energy < 0.7) ||
        (0.3 < eachInfo.valence &&
          eachInfo.valence < 0.4 &&
          eachInfo.tempo > 160)
      ) {
        eachInfo.mood.push(
          '비온 후',
          '맑게 갠',
          'clear after rain',
          '상쾌한',
          'refreshed',
          '새로워진',
          'renewed',
          '활기찬',
          'revitalized',
          '맑은 하늘',
          'clean sky'
        );
      }
    } else if (weather === '눈오는 날') {
      if (
        (eachInfo.songName.indexOf('눈') !== -1 ||
          eachInfo.songName.indexOf('겨울') !== -1 ||
          eachInfo.songName.toLowerCase().indexOf('snow') !== -1 ||
          eachInfo.songName.toLowerCase().indexOf('winter') !== -1) &&
        (parseInt(eachInfo.releaseDate.split('-')[1]) <= 2 ||
          parseInt(eachInfo.releaseDate.split('-')[1]) >= 11)
      ) {
        eachInfo.mood.push(
          '눈오는 날',
          'snowy day',
          '겨울 원더랜드',
          'winter wonderland',
          '하얀 날',
          'white day',
          '서리 내리는 날',
          'frosty day',
          '쌀쌀한 날',
          'chilly day'
        );
      }
    } else if (weather === '비/ 흐림') {
      if (
        (eachInfo.danceability < 0.71 &&
          eachInfo.energy < 0.66 &&
          eachInfo.valence < 0.55 &&
          eachInfo.tempo < 100) ||
        eachInfo.songName.indexOf('비') !== -1 ||
        eachInfo.songName.indexOf('빗') !== -1 ||
        eachInfo.songName.indexOf('우산') !== -1 ||
        eachInfo.songName.indexOf('장마') !== -1 ||
        eachInfo.songName.toLowerCase().indexOf('rain') !== -1
      ) {
        eachInfo.mood.push(
          '비/ 흐림',
          'rainy/cloudy',
          '음울한 날',
          'dreary day',
          '우울한 날',
          'gloomy day',
          '이슬비 내리는 날',
          'drizzly day',
          '젖은 날',
          'wet day'
        );
      }
    }
    return eachInfo;
  };

  const weatherMenuBtn = document.querySelector('.weather-menu-btn');
  if (weatherMenuBtn) {
    weatherMenuBtn.addEventListener('click', getWeatherInfo);
  }
});
