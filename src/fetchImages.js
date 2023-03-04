import axios from 'axios';
export { fetchImages };

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '34120015-2fabafcb6d32a905917c5fb2c';
const imageType = 'photo';
const orientation = 'horizontal';
const safeSearch = true;

function fetchImages(seachQuery) {
  return axios.get(
    `${BASE_URL}?key=${API_KEY}&q=${seachQuery}&image_type=${imageType}&orientation=${orientation}&safesearch=${safeSearch}`
  );
}
