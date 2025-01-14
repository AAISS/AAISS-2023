const URL = {
  baseURL: 'http://localhost:8000/',
  services: {
    default: 'api/',
    2021: 'api/2021/',
    2023: 'api/2023/',
    2024: 'api/2024/',
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
