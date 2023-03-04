import { fetchImages } from './fetchImages';
// import { renderImages } from './renderImages';
import Notiflix from 'notiflix';
import './common.css';

const formEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');

formEl.addEventListener('input', onInputData);
formEl.addEventListener('submit', onFormSubmit);

let searchQuery = '';

function onInputData(event) {
  searchQuery = event.target.value.trim();
}

function onFormSubmit(event) {
  event.preventDefault();
  fetchImages(searchQuery).then(res => {
    if (res.data.totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    renderImages(res);
    Notiflix.Notify.success(`Hooray! We found ${res.data.totalHits} images.`);
  });
}

function renderImages(searchQuery) {
  const markup = searchQuery.data.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b> ${likes}
    </p>
    <p class="info-item">
      <b>Views</b> ${views}
    </p>
    <p class="info-item">
      <b>Comments</b> ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b> ${downloads}
    </p>
  </div>
</div>`;
      }
    )
    .join('');
  galleryEl.insertAdjacentHTML('beforeend', markup);
}
