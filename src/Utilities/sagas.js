import { call, put, takeLatest } from 'redux-saga/effects';
import { 
  getAccessToken,
  getTopArtists, 
  getTopSongs, 
  getTopSongsShortTerm, 
  getTopSongsAllTime, 
  getUserInfo, 
  createPlaylist,
  addTracksToPlaylist,
  getRecentlyPlayed,
} from './helpers.js';

function* getAccess (action) {
  try {
    const accessToken = yield call(getAccessToken, action.code);  
    // const userInfo = yield call(getUserInfo, accessToken);
    // const topArtists = yield call(getTopArtists, accessToken);
    // we are here!
    // const recentlyPlayed = yield call(getRecentlyPlayed, accessToken);
    yield put({type: 'ACCESS_TOKENS', accessToken});
    // yield put({type: 'RECENTLY_PLAYED', recentlyPlayed});
    // yield put({type: 'TOP_ARTISTS', topArtists});
    // yield put({type: 'USER_INFO', userInfo});
  } catch (error) {
    yield put({type: 'ACCESS_ERROR', message: error.message});
  }
}

function* getSongs (action) {
  try {
    const topSongs = yield call(getTopSongs, action.token);
    yield put({type: 'TOP_SONGS', topSongs});
  } catch (error) {
    yield put({type: 'GET_SONGS_ERROR', message: error.message});
  }
}

function* getSongsShortTerm (action) {
  try {
    const topSongsShortTerm = yield call(getTopSongsShortTerm, action.token);
    yield put({type: 'TOP_SONGS_SHORT_TERM', topSongsShortTerm});
  } catch (error) {
    yield put({type: 'GET_SONGS_SHORT_TERM_ERROR', message: error.message});  
  }
}

function* getSongsAllTime (action) {
  try {
    const topSongsAllTime = yield call(getTopSongsAllTime, action.token);
    yield put({type: 'TOP_SONGS_ALL_TIME', topSongsAllTime});
  } catch (error) {
    yield put({type: 'GET_SONGS_ALL_TIME_ERROR', message: error.message});
  } 
}

function* postPlaylistToProfile (action) {
  try {
    const playlistId = yield call(createPlaylist, action.actionPayload);
    yield call(addTracksToPlaylist, playlistId, action.actionPayload);
  } catch (error) {
    yield put({type: 'POST_PLAYLIST_ERROR', message: error.message});
  }
}

function* listenForAuth() {
  yield takeLatest('AUTH_CODE', getAccess);
}

function* listenForLoadSongs() {
  yield takeLatest('LOAD_SONGS', getSongs);
}

function* listenForLoadSongsShortTerm() {
  yield takeLatest('LOAD_SONGS_SHORT_TERM', getSongsShortTerm);
}

function* listenForLoadSongsAllTime() {
  yield takeLatest('LOAD_SONGS_ALL_TIME', getSongsAllTime);
}

function* listenForPostPlaylist() {
  yield takeLatest('POST_PLAYLIST', postPlaylistToProfile);
}

export default [
  listenForAuth,
  listenForLoadSongs,
  listenForLoadSongsShortTerm,
  listenForLoadSongsAllTime,
  listenForPostPlaylist,
];
