const modalEl = document.querySelector('#gif-dialog');
const gifContainerElLeft = document.querySelector(`#gif-prev-cont .left`);
const gifContainerElRight = document.querySelector(`#gif-prev-cont .right`);
const searchButtonEl = document.querySelector('#search-button');

const modal = new bootstrap.Modal(modalEl, {
  focus: false,
});

function openGifModal() {
  const dialogInputEl = document.querySelector('#gif-dialog input');
  // const imageUrlEl = document.querySelector('#imageUrl');
  const findButtonEl = document.querySelector('#gif-search');
  modal.show();
  dialogInputEl.addEventListener('keydown', (event) => {
    if (event.isComposing || event.keyCode === 13) {
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

function searchTenor(nextStr) {
  const value = document.querySelector(`#gif-search`).value;
  if (value) {
    searchStarted();
    const url = !nextStr
      ? `/api/tenor/search?str=${value}`
      : `/api/tenor/search?str=${value}&next=${nextStr}`;
    httpGet(url)
      .then(({ list, next }) => {
        console.log('results', next, list);
        const newChilds = list.map((entry) => {
          const img = document.createElement('img');
          img.src = entry.nanoUrl;
          img.onclick = function () {
            selectGif(entry.url);
          };
          img.classList =
            'w-100 border border-dark border-secondary border-2 rounded-4 my-1';
          return img;
        });
        const leftChilds = newChilds.filter((c, ind) => (ind + 1) % 2);
        const rightChilds = newChilds.filter((c, ind) => ind % 2);
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

function nextTenor() {
  searchTenor(nextStr);
}
function initTenor() {
  nextStr = undefined;
  searchTenor();
}

function selectGif(url) {
  console.log('select', url);
  const el = document.querySelector(`#imageUrl`);
  el.value = url;
  // el.setAttribute('disabled', 'disabled');
  modal.hide();
}
