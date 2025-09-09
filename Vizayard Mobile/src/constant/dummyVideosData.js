export const dummyVideosData = [
  {
    id: 1,
    videoUrl:
      'https://www.instagram.com/reel/DMtt6FKvfWB/?igsh=bDltbTNubjg0Mnlu',
  },
  {
    id: 2,
      videoUrl:
      'https://www.instagram.com/reel/DMtt6FKvfWB/?igsh=bDltbTNubjg0Mnlu',
  },
  {
    id: 3,
     videoUrl:
      'https://www.instagram.com/reel/DMtt6FKvfWB/?igsh=bDltbTNubjg0Mnlu',
  },
  {
    id: 4,
     videoUrl:
      'https://www.instagram.com/reel/DMtt6FKvfWB/?igsh=bDltbTNubjg0Mnlu',
  },
  {
    id: 5,
   videoUrl:
      'https://www.instagram.com/reel/DMtt6FKvfWB/?igsh=bDltbTNubjg0Mnlu',
  },
  {
    id: 6,
     videoUrl:
      'https://www.instagram.com/reel/DMtt6FKvfWB/?igsh=bDltbTNubjg0Mnlu',
  },
  {
    id: 7,
      videoUrl:
      'https://www.instagram.com/reel/DMtt6FKvfWB/?igsh=bDltbTNubjg0Mnlu',
  },
  {
    id: 8,
     videoUrl:
      'https://www.instagram.com/reel/DMtt6FKvfWB/?igsh=bDltbTNubjg0Mnlu',
  },
  {
    id: 9,
      videoUrl:
      'https://www.instagram.com/reel/DMtt6FKvfWB/?igsh=bDltbTNubjg0Mnlu',
  },
  {
    id: 10,
      videoUrl:
      'https://www.instagram.com/reel/DMtt6FKvfWB/?igsh=bDltbTNubjg0Mnlu',
  },
];

export const getTrendingVideos = async () => {
  // Simulate API delay
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        data: {
          data: dummyVideosData,
          success: true,
          message: 'Videos fetched successfully',
        },
      });
    }, 1500); // 1.5 second delay to show loading
  });
};
