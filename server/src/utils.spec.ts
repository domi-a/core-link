/** @format */

import { convertSpecialStrings } from './utils';

describe('utils', () => {
  it('should supersize single line emoji', () => {
    expect(convertSpecialStrings('asdasd asdasd !\r\n 👌')).toContain(
      '<p style="font-size:3rem;">👌</p>'
    );

    expect(convertSpecialStrings('asdasd asdasd !\r\n 👌\r\n')).toContain(
      '<p style="font-size:3rem;">👌</p>'
    );

    expect(
      convertSpecialStrings('asdasd asdasd !\r\n 👌\r\n sadsdf sdfsdf\r\n')
    ).toContain('<p style="font-size:3rem;">👌</p>');

    expect(convertSpecialStrings('asdasd asdasd !\r\n 👌')).toContain(
      '<p style="font-size:3rem;">👌</p>'
    );
  });

  it('should convert text urls to links', () => {
    expect(convertSpecialStrings('asdasd asdasd google.com asdasd')).toContain(
      '<a href="https://google.com" target="_blank">google.com</a>'
    );

    expect(
      convertSpecialStrings('asdasd asdasd !\r\n google.de\r\n')
    ).toContain('<a href="https://google.de" target="_blank">google.de</a>');

    expect(convertSpecialStrings('asdasd asdasd http://google.net')).toContain(
      '<a href="https://google.net" target="_blank">google.net</a>'
    );

    expect(
      convertSpecialStrings('asdasd asdasd https://google.info asd')
    ).toContain(
      '<a href="https://google.info" target="_blank">google.info</a>'
    );
  });

  it('should convert special text formats', () => {
    expect(convertSpecialStrings('pre *boldtext* post')).toContain(
      'pre <span class="fw-bold">boldtext</span> post'
    );

    expect(convertSpecialStrings('pre !\r\n _italictext_ \r\npost')).toContain(
      'pre !\r\n <em class="">italictext</em> \r\npost'
    );

    expect(convertSpecialStrings('pre ~strokedtext~ post')).toContain(
      'pre <s class="">strokedtext</s> post'
    );
  });
});
