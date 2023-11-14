export type FileType = {
  [mimeType: string]: string;
};

export const audioExtensions: FileType = {
  'audio/mpeg': '.mp3',
};

export const imageExtensions: FileType = {
  'image/jpeg': '.jpeg',
  'image/jpg': '.jpg',
  'image/png': '.png',
};

export const extensions: FileType = {...audioExtensions, ...imageExtensions}