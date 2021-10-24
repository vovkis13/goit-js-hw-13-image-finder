import FetchPictures from './apiService.js';
import cardHBSTamplate from '../card.hbs';
const fetchPictures = new FetchPictures();

const bodyRef = document.querySelector('body');
const inputRef = document.querySelector('input');
const moreBtnRef = document.querySelector('.moreBtn');
const galleryRef = document.querySelector('.gallery');

const debounce = require('lodash.debounce');
const DELAY = 500;

inputRef.addEventListener('input', debounce(onInputText, DELAY));
moreBtnRef.addEventListener('click', onMoreBtnClick);
galleryRef.addEventListener('click', onImgClick);

async function onInputText(e) {
  galleryRef.innerHTML = '';
  e.preventDefault();
  fetchPictures.page += 1;
  if (!e.target.value.trim()) return;
  fetchPictures.query = e.target.value;
  const res = await fetchPictures.goFetch();
  renderGallery(res.hits);
  moreBtnRef.focus();
}

async function onMoreBtnClick(e) {
  if (!fetchPictures.page) return;
  e.preventDefault();
  fetchPictures.page += 1;
  const res = await fetchPictures.goFetch();
  renderGallery(res.hits);
  smoothScrollingToBottom(bodyRef, galleryRef);
}

function onImgClick(e) {
  console.log(e);
  if (e.target.nodeName === 'IMG') {
    renderCard(e.target);
  }
}

function renderGallery(hits) {
  galleryRef.insertAdjacentHTML('beforeend', cardHBSTamplate({ hits }));
}

function smoothScrollingToBottom(body, collection) {
  const lastItemRef = collection.lastElementChild.querySelector('.card__img');
  const scrollOptions = { behavior: 'smooth', block: 'end' };
  lastItemRef.addEventListener('load', body.scrollIntoView.bind(body, scrollOptions));
}

function renderCard(currentItem) {}
