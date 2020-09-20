// format the timestamp to format: 'YYYY.MM.DD HH:MM:SS'
export const formatDate = (timestamp: string) =>
  new Date(+timestamp)
    .toISOString()
    .replace(/T/, ' ')
    .replace(/\..+/, '')
    .split('-')
    .join('.');
