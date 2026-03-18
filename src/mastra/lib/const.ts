export const SKIP_PATTERNS = [
  /\.lock$/,
  /\.lockb$/,
  /package-lock\.json$/,
  /yarn\.lock$/,
  /pnpm-lock\.yaml$/,
  /node_modules\//,
  /dist\//,
  /build\//,
  /\.min\.(js|css)$/,
  /\.(png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|mp4|webm|mp3)$/,
  /\.map$/,
  /\.generated\./,
  /__snapshots__\//,
];

export const MAX_ADF_DEPTH = 20;

export const BLOCK_TYPES = [
  "paragraph",
  "heading",
  "listItem",
  "bulletList",
  "orderedList",
];
