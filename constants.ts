import { Gift, User } from './types';

export const GIFTS: Gift[] = [
  { id: 'rose', name: 'Rose', icon: '🌹', cost: 10 },
  { id: 'heart', name: 'Heart', icon: '❤️', cost: 25 },
  { id: 'chocolate', name: 'Chocolate', icon: '🍫', cost: 50 },
  { id: 'diamond', name: 'Diamond', icon: '💎', cost: 100 },
  { id: 'ring', name: 'Ring', icon: '💍', cost: 500 },
];

export const PROFILE_OPTIONS = {
  educationLevel: ['High School', 'Undergrad', 'Postgrad', 'PhD', 'Trade School'],
  drinking: ['Socially', 'Never', 'Frequently', 'Sober'],
  smoking: ['Socially', 'Never', 'Regularly', 'Trying to quit'],
  lookingFor: ['Relationship', 'Casual', 'Don\'t know yet', 'Marriage'],
  kids: ['Want someday', 'Don\'t want', 'Have & want more', 'Have & don\'t want more'],
  haveKids: ['No', 'Yes', 'Yes, they live with me', 'Yes, they live away'],
  starSign: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'],
  politics: ['Liberal', 'Moderate', 'Conservative', 'Apolitical', 'Other'],
  religion: ['Agnostic', 'Atheist', 'Christian', 'Muslim', 'Jewish', 'Buddhist', 'Hindu', 'Other', 'Spiritual'],
  exercise: ['Active', 'Sometimes', 'Almost never', 'Every day'],
  languages: ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Korean', 'Italian', 'Portuguese', 'Russian', 'Arabic', 'Hindi']
};

export const AVAILABLE_INTERESTS = [
  'Photography', 'Traveling', 'Cooking', 'Music', 'Hiking', 'Yoga', 'Gaming', 
  'Art', 'Reading', 'Movies', 'Gym', 'Coffee', 'Wine', 'Dancing', 'Pets', 
  'Politics', 'Fashion', 'Writing', 'Running', 'Swimming', 'Camping', 'Baking',
  'Volunteering', 'Gardening', 'Board Games', 'Surfing', 'Skiing', 'Cycling'
];

export const MOCK_USERS: User[] = [
  {
    id: '1',
    firstName: 'Jessica',
    lastName: 'Alba',
    age: 24,
    gender: 'Female',
    interestedIn: 'Male',
    email: 'jess@example.com',
    phone: '555-0101',
    about: 'Lover of hiking, coffee, and code. Looking for someone to share adventures with.',
    avatarUrl: 'https://picsum.photos/400/600?random=1',
    photos: [
      'https://picsum.photos/400/600?random=1',
      'https://picsum.photos/400/600?random=11',
      'https://picsum.photos/400/600?random=12'
    ],
    isOnline: true,
    distance: 2,
    work: 'Software Engineer',
    education: 'Stanford University',
    hometown: 'Los Angeles',
    currentLocation: 'San Francisco, CA',
    interests: ['Hiking', 'Coffee', 'Coding', 'Movies'],
    details: {
      height: '5\'7"',
      exercise: 'Active',
      drinking: 'Socially',
      smoking: 'Never',
      starSign: 'Taurus',
      lookingFor: 'Relationship',
      languages: ['English', 'Spanish']
    }
  },
  {
    id: '2',
    firstName: 'David',
    lastName: 'Chen',
    age: 28,
    gender: 'Male',
    interestedIn: 'Female',
    email: 'david@example.com',
    phone: '555-0102',
    about: 'Chef by day, gamer by night. I make the best lasagna you will ever taste.',
    avatarUrl: 'https://picsum.photos/400/601?random=2',
    photos: ['https://picsum.photos/400/601?random=2'],
    isOnline: false,
    distance: 5,
    work: 'Head Chef',
    education: 'Culinary Institute',
    hometown: 'New York',
    currentLocation: 'San Francisco, CA',
    interests: ['Cooking', 'Gaming', 'Food'],
    details: {
      starSign: 'Leo',
      drinking: 'Socially'
    }
  },
  {
    id: '3',
    firstName: 'Sarah',
    lastName: 'Jones',
    age: 26,
    gender: 'Female',
    interestedIn: 'Male',
    email: 'sarah@example.com',
    phone: '555-0103',
    about: 'Art enthusiast and museum hopper. Let’s paint the town red!',
    avatarUrl: 'https://picsum.photos/400/602?random=3',
    photos: ['https://picsum.photos/400/602?random=3'],
    isOnline: true,
    distance: 12,
    interests: ['Art', 'Museums', 'Painting'],
    details: {}
  },
  {
    id: '4',
    firstName: 'Michael',
    lastName: 'Ross',
    age: 30,
    gender: 'Male',
    interestedIn: 'Female',
    email: 'mike@example.com',
    phone: '555-0104',
    about: 'Entrepreneur building the next big thing. Need a partner in crime.',
    avatarUrl: 'https://picsum.photos/400/603?random=4',
    photos: ['https://picsum.photos/400/603?random=4'],
    isOnline: true,
    distance: 1,
    work: 'Founder',
    interests: ['Business', 'Tech'],
    details: {}
  },
  {
    id: '5',
    firstName: 'Emily',
    lastName: 'Blunt',
    age: 22,
    gender: 'Female',
    interestedIn: 'Male',
    email: 'emily@example.com',
    phone: '555-0105',
    about: 'Student of life. Yoga instructor. Good vibes only ✨',
    avatarUrl: 'https://picsum.photos/400/604?random=5',
    photos: ['https://picsum.photos/400/604?random=5'],
    isOnline: false,
    distance: 8,
    work: 'Yoga Instructor',
    interests: ['Yoga', 'Meditation', 'Wellness'],
    details: {}
  }
];