import NewsImages from './fetchImages';
import Notiflix from 'notiflix';
import './common.css';

const formEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreEl = document.querySelector('.load-more');

const newImages = new NewsImages();

formEl.addEventListener('submit', onFormSubmit);
loadMoreEl.addEventListener('click', onLoadMore);

function onFormSubmit(event) {
  event.preventDefault();

  newImages.query = event.currentTarget.elements.searchQuery.value.trim();
  console.log(newImages.query);

  newImages.fetchImages().then(res => {
    console.log(res);
    if (res.totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    renderImages(res);
    Notiflix.Notify.success(`Hooray! We found ${res.totalHits} images.`);
  });
}

function renderImages(searchQuery) {
  const markup = searchQuery.hits
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

function onLoadMore() {
  newImages.fetchImages().then(renderImages);
}
