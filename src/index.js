import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import NewsImages from './fetchImages';
import HiddenButton from './load-more-btn';

import './common.css';


const formEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreEl = document.querySelector('.load-more');

const btnLoadMore = new HiddenButton('.load-more');
const lightbox = new SimpleLightbox('.gallery a', {});
const newImages = new NewsImages();

formEl.addEventListener('submit', onFormSubmit);
loadMoreEl.addEventListener('click', onLoadMore);

async function onFormSubmit(event) {
  event.preventDefault();

  newImages.query = event.currentTarget.elements.searchQuery.value.trim();

  if (newImages.query === '') {
    return;
  }

  newImages.resetPage();
  onCleanGallery();
  btnLoadMore.hide();

  try {
    const res = await newImages.fetchImages();
    if (res.totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    renderImages(res);
    btnLoadMore.show();
    Notiflix.Notify.success(`Hooray! We found ${res.totalHits} images.`);
    lightbox.refresh();
    onCheckLastPage(res);
    newImages.incrementPage();
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure('Something went wrong. Please try again.');
  }
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

  if (newImages.page > 1) {
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
}

async function onLoadMore() {
  const res = await newImages.fetchImages();
  renderImages(res);
  onCheckLastPage(res);
  newImages.incrementPage();
  lightbox.refresh();
}

function onCleanGallery() {
  galleryEl.innerHTML = '';
}

function onCheckLastPage(res) {
  if (newImages.page === Math.ceil(res.totalHits / 40)) {
    btnLoadMore.hide();
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
    return;
  }
}
