export const formatDate = (date: string): string => {
  const options = {
    // hour: 'numeric',
    // minute: 'numeric',
    // day: 'numeric',
    // month: 'long',
    // year: 'numeric',
  };

  return new Date(date).toLocaleDateString('en-GB', options);
}
