import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '34120015-2fabafcb6d32a905917c5fb2c';

const searchParams = new URLSearchParams({
  imageType: 'photo',
  orientation: 'horizontal',
  safeSearch: 'true',
  per_page: '40',
});

export default class NewsImages {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  fetchImages() {
    const url = `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&page=${
      this.page
    }&${searchParams.toString()}`;

    return axios
      .get(url)
      .then(({ data }) => {
        if (
          data &&
          data.hits.length &&
          data.hits.length * this.page >= data.totalHits
        ) {
          Notiflix.Notify.info(
            "We're sorry, but you've reached the end of search results."
          );
          return;
        }

        return data;
      })
      .catch(error => console.log(error))
      .finally(() => this.incrementPage());
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get pages() {
    return this.page;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
