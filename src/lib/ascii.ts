interface ScaleOptions {
  maxWidth: number;
  maxHeight: number;
}

export function scaleAsciiArt(ascii: string, options: ScaleOptions): string {
  const lines = ascii.split('\n');
  const originalHeight = lines.length;
  const originalWidth = Math.max(...lines.map(line => line.length));

  // Calculate scaling factors
  const widthRatio = options.maxWidth / originalWidth;
  const heightRatio = options.maxHeight / originalHeight;
  const ratio = Math.min(widthRatio, heightRatio);

  // If the ASCII art is already smaller than the target size, return it as is
  if (ratio >= 1) return ascii;

  const targetHeight = Math.floor(originalHeight * ratio);
  const targetWidth = Math.floor(originalWidth * ratio);

  const scaled: string[] = [];
  
  for (let y = 0; y < targetHeight; y++) {
    let newLine = '';
    for (let x = 0; x < targetWidth; x++) {
      // Map the scaled coordinates back to the original ASCII art
      const originalY = Math.floor(y / ratio);
      const originalX = Math.floor(x / ratio);
      
      // Get the character from the original position
      const char = lines[originalY]?.[originalX] || ' ';
      newLine += char;
    }
    scaled.push(newLine);
  }

  return scaled.join('\n');
} 