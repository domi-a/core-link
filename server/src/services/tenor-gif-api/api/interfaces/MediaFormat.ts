/**
 * Interface representing a content format object in the Tenor API.
 * This interface can be used to define the properties for different formats such as GIF, MP4, WebM, etc.
 *
 * @format
 */
export interface ContentFormatDetails {
  /**
   * A URL to the media source.
   */
  url: string;

  /**
   * The dimensions of the media in pixels.
   * The first element is the width, and the second element is the height.
   */
  dims: number[];

  /**
   * The duration of the media in seconds for one loop of the content.
   * If the content is static, the duration is set to 0.
   */
  duration: number;

  /**
   * The size of the file in bytes.
   */
  size: number;
}

export interface MediaFormats {
  gif: ContentFormatDetails;
  mediumgif: ContentFormatDetails;
  tinygif: ContentFormatDetails;
  nanogif: ContentFormatDetails;
  mp4: ContentFormatDetails;
  loopedmp4: ContentFormatDetails;
  tinymp4: ContentFormatDetails;
  nanomp4: ContentFormatDetails;
  webm: ContentFormatDetails;
  tinywebm: ContentFormatDetails;
  nanowebm: ContentFormatDetails;
  webp_transparent: ContentFormatDetails;
  tinywebp_transparent: ContentFormatDetails;
  nanowebp_transparent: ContentFormatDetails;
  gif_transparent: ContentFormatDetails;
  tinygif_transparent: ContentFormatDetails;
  nanogif_transparent: ContentFormatDetails;
}
