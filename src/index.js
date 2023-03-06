import NewsImages from './fetchImages';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './common.css';

const formEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreEl = document.querySelector('.load-more');

const lightbox = new SimpleLightbox('.gallery a', {});

const newImages = new NewsImages();

formEl.addEventListener('submit', onFormSubmit);
loadMoreEl.addEventListener('click', onLoadMore);
onHideBtn();

function onFormSubmit(event) {
  event.preventDefault();

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
    lightbox.refresh();
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
        return `<a class="photo-item" href = "${largeImageURL}"><div class="photo-card">
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
</div></a>`;
      }
    )
    .join('');

  galleryEl.insertAdjacentHTML('beforeend', markup);
  onShowBtn();
}

function onLoadMore() {
  newImages.fetchImages().then(res => {
    onCheckingNumberImages(res);
    renderImages(res);

    lightbox.refresh();
  });
}

function onCleanGallery() {
  galleryEl.innerHTML = '';
}

function onHideBtn() {
  loadMoreEl.classList.remove('is-show');
}

function onShowBtn() {
  loadMoreEl.classList.add('is-show');
}

function onCheckingNumberImages(res) {
  if (newImages.totalimages >= res.totalHits) {
    onHideBtn();
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );

    return;
  }
}
