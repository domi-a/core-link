const modalEl = document.querySelector('#gif-dialog');
const gifContainerElLeft = document.querySelector(`#gif-prev-cont .left`);
const gifContainerElRight = document.querySelector(`#gif-prev-cont .right`);
const searchButtonEl = document.querySelector('#search-button');

const modal = new bootstrap.Modal(modalEl, {
  focus: false,
});

function openGifModal() {
  const dialogInputEl = document.querySelector('#gif-dialog input');
  const findButtonEl = document.querySelector('#gif-search');
  modal.show();
  dialogInputEl.addEventListener('keydown', (event) => {
    if (event.keyCode === 13) {
      searchTenor();
      searchButtonEl.focus();
      return;
    }
  });
  modalEl.addEventListener('shown.bs.modal', () => {
    dialogInputEl.focus();
  });
  modalEl.addEventListener('hide.bs.modal', () => {
    findButtonEl.focus();
  });
}

function httpGet(theUrl) {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json');
  const request = new Request(theUrl, {
    method: 'GET',
    headers: headers,
  });
  return fetch(request).then((res) => res.json());
}
let nextStr = undefined;
const loadingEl = document.querySelector(`#gif-loading`);
const moreEl = document.querySelector(`#more`);

function searchStarted() {
  nextStr = undefined;
  loadingEl.classList.remove('visually-hidden');
  moreEl.classList.add('visually-hidden');
}

function searchFinished(next) {
  if (next) {
    nextStr = next;
    loadingEl.classList.add('visually-hidden');
    moreEl.classList.remove('visually-hidden');
  } else {
    loadingEl.classList.add('visually-hidden');
  }
}

let [leftChilds, rightChilds] = [[], []];
let [leftHeightRatio, rightHeightRatio] = [0, 0];
function searchTenor(nextStr) {
  const value = document.querySelector(`#gif-search`).value;
  if (value) {
    searchStarted();
    const url = !nextStr
      ? `/api/tenor/search?str=${value}`
      : `/api/tenor/search?str=${value}&next=${nextStr}`;
    httpGet(url)
      .then(({ list, next }) => {
        if (!nextStr) {
          [leftChilds, rightChilds] = [[], []];
          [leftHeightRatio, rightHeightRatio] = [0, 0];
        }
        for (const item of list) {
          if (leftHeightRatio < rightHeightRatio) {
            leftChilds.push(createImage(item));
            leftHeightRatio += item.height2Width;
          } else {
            rightChilds.push(createImage(item));
            rightHeightRatio += item.height2Width;
          }
        }
        if (!nextStr) {
          gifContainerElLeft.replaceChildren(...leftChilds);
          gifContainerElRight.replaceChildren(...rightChilds);
        } else {
          gifContainerElLeft.append(...leftChilds);
          gifContainerElRight.append(...rightChilds);
        }
        searchFinished(next);
      })
      .catch((e) => {
        return console.error(e);
      });
  }
}

function createImage(entry) {
  const img = document.createElement('img');
  img.src = entry.nanoUrl;
  img.classList = 'w-100 border border-light-subtle border-3 rounded-3';
  const a = document.createElement('a');
  a.classList = 'w-100';
  a.onclick = function () {
    selectGif(entry.url);
  };
  a.appendChild(img);
  return a;
}

function nextTenor() {
  searchTenor(nextStr);
}
function initTenor() {
  nextStr = undefined;
  searchTenor();
}

function selectGif(url) {
  // console.log('select', url);
  const el = document.querySelector(`#imageUrl`);
  el.value = url;
  modal.hide();
}
