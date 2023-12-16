import axios from 'axios';

export async function listAllPhotoFrames() {
  const { data } = await axios({
    baseURL: 'https://ctxhhutech.com',
    // baseURL: 'http://localhost:8088',
    url: '/wp-json/ctxh-frame-avatar/v1/photo_frames',
    method: 'GET',
    timeout: 3000
  });

  return data.filter(elm => !!elm.url);
}
