export const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;
export const flagImage = 'https://i.postimg.cc/nrdJWpr3/flag.png';

export const dummyUserImage = 'https://i.postimg.cc/HLky2cQ6/110604197.jpg';

export const carImages = [
  'https://i.postimg.cc/wxrMHZXq/car1.png',
  'https://i.postimg.cc/zGZfHh24/car2.png',
  'https://i.postimg.cc/HLTsBgg2/car3.png',
  'https://i.postimg.cc/26KkkLBc/car4.png',
  'https://i.postimg.cc/F1thctp0/car5.png',
  'https://i.postimg.cc/J0H1G7N1/car6.png',
  'https://i.postimg.cc/xdgjZ4jS/car7.png',
  'https://i.postimg.cc/L6f1W2cK/car8.png',
  'https://i.postimg.cc/Jnn7C5tH/car9.png',
  'https://i.postimg.cc/Dwrwrzt0/car10.png',
  'https://i.postimg.cc/G34Ykkzp/car11.png',
  'https://i.postimg.cc/9Xs91rNY/car12.png',
  'https://i.postimg.cc/BvZPtDX4/car13.png',
  'https://i.postimg.cc/qvxCkQB1/car14.png'
];

export const selectRandomCarImage = (): string => {
  const selectedCarImage = localStorage.getItem('selected-car-image');
  if (!selectedCarImage || !selectedCarImage.includes(selectedCarImage)) {
    const length = carImages.length;
    const randomIndex = Math.floor(Math.random() * length);
    const randomImage = carImages[randomIndex];
    localStorage.setItem('selected-car-image', randomImage);
  }
  const carImage = localStorage.getItem('selected-car-image');
  return carImage || '';
};

export const chartColors = {
  speed: '#0ea5e9',
  accuracy: '#22c55e',
  error: '#f43f5e'
};
