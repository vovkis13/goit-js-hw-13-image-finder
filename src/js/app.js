import FetchPictures from './apiService.js';
import cardHBSTamplate from '../card.hbs';
const fetchPictures = new FetchPictures();

import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';

import { notice, info } from '@pnotify/core/';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/Material.css';
const NOTICE_STYLE = 'material';
const NOTICE_DELAY = 2000;
const emptyNoticeOptions = {
  styling: NOTICE_STYLE,
  title: 'Empty query',
  text: 'your query is empty',
  delay: NOTICE_DELAY,
};
const notFoundNoticeOptions = {
  styling: NOTICE_STYLE,
  title: 'No photos found',
  text: 'no results were found for this query.',
  delay: NOTICE_DELAY,
};
const infoOptions = {
  styling: NOTICE_STYLE,
  title: 'Here is the result:',
  delay: NOTICE_DELAY,
};

const bodyRef = document.querySelector('body');
const inputRef = document.querySelector('input');
const moreBtnRef = document.querySelector('.moreBtn');
const galleryRef = document.querySelector('.gallery');

const debounce = require('lodash.debounce');
const DELAY = 500;
let lightBoxInstance = null;

inputRef.addEventListener('input', debounce(onInputText, DELAY));
moreBtnRef.addEventListener('click', onMoreBtnClick);
galleryRef.addEventListener('click', onImgClick);
window.addEventListener('keydown', onEscapeLightBox);

async function onInputText(e) {
  galleryRef.innerHTML = '';
  if (!e.target.value.trim()) {
    notice(emptyNoticeOptions);
    fetchPictures.clearQuery();
    return;
  }
  e.preventDefault();
  fetchPictures.incrementPage();
  const resolve = await fetchPictures.goFetch(e.target.value);
  if (!resolve.hits.length) {
    notice(notFoundNoticeOptions);
    return;
  }
  infoOptions.text = `Found ${resolve.total} photos`;
  info(infoOptions);
  renderGallery(resolve.hits);
}

async function onMoreBtnClick(e) {
  if (fetchPictures.queryIsEmpty()) {
    console.log(fetchPictures.query);
    return;
  }
  e.preventDefault();
  fetchPictures.incrementPage();
  const resolve = await fetchPictures.goFetch();
  renderGallery(resolve.hits);
  smoothScrollingToBottom(bodyRef, galleryRef);
}

function onImgClick(e) {
  if (e.target.nodeName === 'IMG') {
    lightBoxInstance = basicLightbox.create(
      `<img src=${e.target.dataset.src} width="800" height="600">`,
    );
    lightBoxInstance.show();
  }
}
function onEscapeLightBox(e) {
  if (e.key === 'Escape' && basicLightbox.visible()) lightBoxInstance.close();
}

function renderGallery(hits) {
  galleryRef.insertAdjacentHTML('beforeend', cardHBSTamplate({ hits }));
}

function smoothScrollingToBottom(body, collection) {
  const lastItemRef = collection.lastElementChild.querySelector('.card__img');
  const scrollOptions = { behavior: 'smooth', block: 'end' };
  lastItemRef.addEventListener('load', body.scrollIntoView.bind(body, scrollOptions));
}
