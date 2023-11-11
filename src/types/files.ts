export type FileType = {
  [mimeType: string]: string;
};

export const audioExtensions: FileType = {
  'audio/mpeg': '.mp3',
  'audio/aac': '.aac',
  'audio/ogg': '.ogg',
  'audio/wav': '.wav',
  'audio/flac': '.flac',
  'audio/opus': '.opus',
};

export const imageExtensions: FileType = {
  'image/jpeg': '.jpeg',
  'image/jpg': '.jpg',
  'image/webp': '.webp',
  'image/png': '.png',
};

export const extensions: FileType = {...audioExtensions, ...imageExtensions}