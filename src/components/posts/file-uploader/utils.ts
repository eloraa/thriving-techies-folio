export const getFileSizeMB = (size: number): number => {
  return size / 1000 / 1000;
};

export const checkType = (file: File, types: string[]): boolean => {
  const extension = file.name.split('.').pop();
  const loweredTypes = types.map(type => type.toLowerCase());
  if (!extension) return false;
  return loweredTypes.includes(extension.toLowerCase());
};

export const acceptedExt = (types?: string[]): string => {
  if (!types?.length) return '';
  return types.map(type => `.${type.toLowerCase()}`).join(',');
};
