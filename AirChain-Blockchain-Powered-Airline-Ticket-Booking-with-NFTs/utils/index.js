export const minutesToHours = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}H${remainingMinutes}M`;
};

export const hexToRGB = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

export const getRelativeLuminance = (rgb) => {
  const [r, g, b] = rgb.map((val) => {
      const sRGBVal = val / 255;
      return sRGBVal <= 0.03928 ? sRGBVal / 12.92 : ((sRGBVal + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}