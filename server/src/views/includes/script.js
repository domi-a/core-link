function copy() {
  let inputElement = document.querySelector('#url');
  console.log('copy', inputElement.value);
  //   copyText.select();
  //   document.copy('copy');
  navigator.clipboard.writeText(inputElement.value).then(
    () => {
      inputElement.setAttribute('disabled', 'disabled');
    },
    () => {
      /* clipboard write failed */
    }
  );
}

function eraseValue(selector) {
  const el = document.querySelector(`${selector}`);
  el.value = '';
  el.removeAttribute('disabled');
}
