export default class {
  constructor() {
    this.orientation = 'horizontal';
    this.query = '';
    this.page = 0;
    this.per_page = 12;
    this.API_KEY = '23902018-2ad96957ecb94a5813d6bfdc3';
    this.URL = 'https://pixabay.com/api/';
  }
  goFetch() {
    return fetch(
      this.URL +
        `?image_type=photo&orientation=${this.orientation}&q=${this.query}&page=${this.page}&per_page=${this.per_page}&key=${this.API_KEY}`,
    ).then(res => res.json());
  }
}
