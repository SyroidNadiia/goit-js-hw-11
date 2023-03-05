import NewsImages from './fetchImages';
import Notiflix from 'notiflix';
import './common.css';

const formEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreEl = document.querySelector('.load-more');

const newImages = new NewsImages();

formEl.addEventListener('submit', onFormSubmit);
loadMoreEl.addEventListener('click', onLoadMore);
onHideBtn();

function onFormSubmit(event) {
  event.preventDefault();
  onHideBtn();

  newImages.query = event.currentTarget.elements.searchQuery.value.trim();

  newImages.resetPage();
  onCleanGallery();

  newImages.fetchImages().then(res => {
    if (res.totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    onCheckingNumberImages(res);

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
  onShowBtn();
}

function onLoadMore() {
  newImages.fetchImages().then(res => {
    renderImages(res);
    onCheckingNumberImages(res);
  });
}

function onCleanGallery() {
  galleryEl.innerHTML = '';
}

function onShowBtn() {
  loadMoreEl.classList.remove('is-hidden');
}

function onHideBtn() {
  loadMoreEl.classList.add('is-hidden');
}

function onCheckingNumberImages(res) {
  if (res.hits.length * newImages.pages >= res.totalHits) {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
    onHideBtn();
  }
}
