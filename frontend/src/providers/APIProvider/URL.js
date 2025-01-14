const URL = {
  baseURL: 'https://autaaiss.com/',
  services: {
    default: 'api/',
    2021: 'api/2021/',
    2023: 'api/2023/',
    2024: 'api/2024/',
    2025: 'api/2025/',
    2026: 'api/2026/',
  },
  endpoints: {
    staff: 'staff/',
    workshop: 'workshop/',
    misc: 'misc/',
    user: {
      default: 'user/',
      activate: 'activate/',
      presentation: 'user/presentation/',
      workshop: 'user/workshop/',
    },
    token: {
      default: 'token/',
      refresh: 'token/refresh/',
    },
    payment: {
      default: 'api/payment/',
      verify: 'payment/verify/',
    },
    committee: 'committee/',
    presenter: 'presenter/', //here
    teacher: 'teacher/', //YES
    presentation: 'presentation/', //YES
  },
};

export default URL;
