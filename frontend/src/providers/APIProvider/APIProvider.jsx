import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Helper } from '../../utils/Helper.js';
import { useConfig } from '../config-provider/ConfigProvider.jsx';
import URL from './URL';

export function APIProvider({ children }) {
  const { accessToken, refreshToken, setAccessTokenFromLocalStorage } = useConfig();

  const service = axios;
  const currentYear = new Date().getFullYear();

  const [workshopsData, setWorkshopsData] = useState();
  const [presentationsData, setPresentationsData] = useState();
  const [teachersData, setTeachersData] = useState();
  const [staffData, setStaffData] = useState();
  const [miscData, setMiscData] = useState();
  const [userData, setUserData] = useState();
  const [createUserData, setCreateUserData] = useState();
  const [updateUserData, setUpdateUserData] = useState();
  const [partiallyUpdateUserData, setPartiallyUpdateUserData] = useState();
  const [deleteUserData, setDeleteUserData] = useState();
  const [activateUserData, setActivateUserData] = useState();
  const [paymentData, setPaymentData] = useState();
  const [verifyPaymentData, setVerifyPaymentData] = useState();
  const [committeeData, setCommitteeData] = useState();
  const [presenterData, setPresenterData] = useState();
  const [addToCartResponse, setAddToCartResponse] = useState();
  const [issueTokenResponse, setIssueTokenResponse] = useState();
  const [userWorkshopsData, setUserWorkshopsData] = useState();
  const [userPresentationsData, setUserPresentationsData] = useState();
  const [removeFromCartResponse, setRemoveFromCartResponse] = useState();

  const getAccessTokenHeader = useCallback(() => {
    return `Bearer ${accessToken}`;
  }, [accessToken]);

  const refreshAccessToken = useCallback(() => {
    const data = {
      refresh: refreshToken,
    };
    service
      .post(`${URL.baseURL}${URL.services.default}${URL.endpoints.token.refresh}`, data)
      .then((response) => {
        localStorage['user'] = JSON.stringify(response.data);
        setAccessTokenFromLocalStorage();
        window.location.reload();
      })
      .catch((error) => {
        if (error == null) return;

        console.log(error);
        if (error.response.status === 401) {
          localStorage.removeItem('user');
          window.location.reload();
        }
      });
  }, [refreshToken, service, setAccessTokenFromLocalStorage]);

  const updateAccessTokenWithRefreshToken = useCallback(() => {
    refreshAccessToken();
  }, [refreshAccessToken]);

  const removeFromUserCart = useCallback(
    async ({ id, type }) => {
      let endpoint;
      switch (type) {
        case 'workshop':
          endpoint = URL.endpoints.user.workshop;
          break;
        case 'presentation':
          endpoint = URL.endpoints.user.presentation;
          break;
        default:
          break;
      }
      await service
        .delete(`${URL.baseURL}${URL.services.default}${endpoint}${`${id}/`}`, {
          headers: {
            Authorization: getAccessTokenHeader(),
          },
        })
        .then((response) => {
          setRemoveFromCartResponse(response);
        })
        .catch((error) => {
          setRemoveFromCartResponse(error?.response);
          if (!error) return;

          if (error.response.status === 401) {
            updateAccessTokenWithRefreshToken();
          }
        });
    },
    [getAccessTokenHeader, service, updateAccessTokenWithRefreshToken],
  );

  const getUserPresentations = useCallback(
    async (data) => {
      await service
        .get(`${URL.baseURL}${URL.services.default}${URL.endpoints.user.presentation}`, {
          headers: {
            Authorization: getAccessTokenHeader(),
          },
        })
        .then((response) => {
          setUserPresentationsData(response);
        })
        .catch((error) => {
          setUserPresentationsData(error?.response);
          if (!error) return;

          if (error.response.status === 401) {
            updateAccessTokenWithRefreshToken();
          }
        });
    },
    [getAccessTokenHeader, service],
  );

  const getUserWorkshops = useCallback(
    async (data) => {
      await service
        .get(`${URL.baseURL}${URL.services.default}${URL.endpoints.user.workshop}`, {
          headers: {
            Authorization: getAccessTokenHeader(),
          },
        })
        .then((response) => {
          setUserWorkshopsData(response);
        })
        .catch((error) => {
          setUserWorkshopsData(error?.response);
          if (!error) return;

          if (error.response.status === 401) {
            updateAccessTokenWithRefreshToken();
          }
        });
    },
    [getAccessTokenHeader, service],
  );

  const issueToken = useCallback(
    async (data) => {
      await service
        .post(`${URL.baseURL}${URL.services.default}${URL.endpoints.token.default}`, data)
        .then((response) => {
          setIssueTokenResponse(response);
        })
        .catch((error) => {
          setIssueTokenResponse(error?.response);
        });
    },
    [service],
  );

  const addItemToCart = useCallback(
    async ({ type, id }) => {
      const body = {};
      let endpoint = '';
      switch (type) {
        case 'presentation':
          body.presentation = id + '';
          endpoint = URL.endpoints.user.presentation;
          break;
        case 'workshop':
          body.workshop = id + '';
          endpoint = URL.endpoints.user.workshop;
          break;
        default:
          break;
      }

      const tokenStr = JSON.parse(localStorage.getItem('user'))['access'];
      await service
        .post(`${URL.baseURL}${URL.services.default}${endpoint}`, body, {
          headers: { Authorization: `Bearer ${tokenStr}` },
        })
        .then((response) => {
          setAddToCartResponse(response);
        })
        .catch((error) => {
          setAddToCartResponse(error.response);
          if (!error) return;

          if (error.response.status === 401) {
            updateAccessTokenWithRefreshToken();
          }
        });
    },
    [service],
  );

  const getPresenterData = useCallback(
    async (id) => {
      if (id != null) id = id + '/';
      await service
        .get(`${URL.baseURL}${URL.services[currentYear]}${URL.endpoints.presenter}${id ?? ''}`)
        .then((response) => {
          setPresenterData(response.data);
        });
    },
    [currentYear, service],
  );

  const getCommitteeData = useCallback(async () => {
    await service.get(`${URL.baseURL}${URL.services[currentYear]}${URL.endpoints.committee}`).then((response) => {
      setCommitteeData(response.data);
    });
  }, [currentYear, service]);

  const postVerifyPayment = useCallback(
    async (data) => {
      await service
        .get(`${URL.baseURL}${URL.services.default}${URL.endpoints.payment.verify}`, data)
        .then((response) => {
          setVerifyPaymentData(response);
        })
        .catch((error) => {
          setVerifyPaymentData(error.response);
        });
    },
    [currentYear, service],
  );

  const postPaymentData = useCallback(
    async (data) => {
      await service
        .post(`${URL.baseURL}${URL.endpoints.payment.default}`, data, {
          headers: {
            Authorization: getAccessTokenHeader(),
          },
        })
        .then((response) => {
          setPaymentData(response.data);
        });
    },
    [currentYear, service, getAccessTokenHeader],
  );

  const activateUser = useCallback(async () => {
    await service.get(`${URL.baseURL}${URL.services[currentYear]}${URL.endpoints.user.activate}`).then((response) => {
      setActivateUserData(response.data);
    });
  }, [currentYear, service]);

  const deleteUser = useCallback(
    async (data) => {
      await service
        .delete(`${URL.baseURL}${URL.services[currentYear]}${URL.endpoints.user.default}`, data)
        .then((response) => {
          setDeleteUserData(response.data);
        });
    },
    [currentYear, service],
  );

  const partiallyUpdateUser = useCallback(
    async (data) => {
      await service
        .patch(`${URL.baseURL}${URL.services[currentYear]}${URL.endpoints.user.default}`, data)
        .then((response) => {
          setPartiallyUpdateUserData(response.data);
        });
    },
    [currentYear, service],
  );

  const updateUser = useCallback(
    async (data) => {
      await service
        .put(`${URL.baseURL}${URL.services[currentYear]}${URL.endpoints.user.default}`, data)
        .then((response) => {
          setUpdateUserData(response);
        });
    },
    [currentYear, service],
  );

  const createUser = useCallback(
    async (data) => {
      await service
        .post(`${URL.baseURL}${URL.services.default}${URL.endpoints.user.default}`, data)
        .then((response) => {
          setCreateUserData(response);
        })
        .catch((error) => {
          setCreateUserData(error?.response);
        });
    },
    [service],
  );

  const getUserData = useCallback(
    async (id) => {
      if (id != null) id = id + '/';
      await service
        .get(`${URL.baseURL}${URL.services[currentYear]}${URL.endpoints.user.default}${id ?? ''}`)
        .then((response) => {
          setUserData(response.data);
        });
    },
    [currentYear, service],
  );

  const getMiscData = useCallback(
    async (id) => {
      if (id != null) id = id + '/';
      await service
        .get(`${URL.baseURL}${URL.services[currentYear]}${URL.endpoints.misc}${id ?? ''}`)
        .then((response) => {
          setMiscData(response.data);
        });
    },
    [currentYear, service],
  );

  const getStaffData = useCallback(async () => {
    await service.get(`${URL.baseURL}${URL.services[currentYear]}${URL.endpoints.staff}`).then((response) => {
      setStaffData(response.data);
    });
  }, [currentYear, service]);

  const getWorkshopsData = useCallback(
    async (id) => {
      if (id != null) id = id + '/';
      await service
        .get(`${URL.baseURL}${URL.services[currentYear]}${URL.endpoints.workshop}${id ?? ''}`)
        .then((response) => {
          setWorkshopsData(response.data);
        });
    },
    [currentYear, service],
  );

  const getPresentationsData = useCallback(async () => {
    await service.get(`${URL.baseURL}${URL.services[currentYear]}${URL.endpoints.presentation}`).then((response) => {
      setPresentationsData(response.data);
    });
  }, [currentYear, service]);

  const getTeachersData = useCallback(
    async (id) => {
      if (id != null) id = id + '/';
      await service
        .get(`${URL.baseURL}${URL.services[currentYear]}${URL.endpoints.teacher}${id ?? ''}`)
        .then((response) => setTeachersData(response.data));
    },
    [currentYear, service],
  );

  useEffect(() => {
    if (accessToken == null || refreshToken == null) {
      return;
    }

    if (!Helper.checkTokenValidity(accessToken)) {
      updateAccessTokenWithRefreshToken();
    }
  }, [accessToken, refreshToken, service.defaults.headers.common, updateAccessTokenWithRefreshToken]);

  const context = {
    getUserWorkshops,
    userWorkshopsData,
    workshopsData,
    setWorkshopsData,
    setPresentationsData,
    issueToken,
    issueTokenResponse,
    getWorkshopsData,
    presentationsData,
    getPresentationsData,
    teachersData,
    getTeachersData,
    staffData,
    miscData,
    userData,
    setAddToCartResponse,
    createUserData,
    updateUserData,
    partiallyUpdateUserData,
    deleteUserData,
    activateUserData,
    paymentData,
    verifyPaymentData,
    committeeData,
    presenterData,
    getPresenterData,
    getCommitteeData,
    postVerifyPayment,
    postPaymentData,
    activateUser,
    deleteUser,
    partiallyUpdateUser,
    updateUser,
    createUser,
    getUserPresentations,
    userPresentationsData,
    getUserData,
    getMiscData,
    getStaffData,
    addItemToCart,
    addToCartResponse,
    removeFromCartResponse,
    removeFromUserCart,
    setRemoveFromCartResponse,
  };

  return <APIContext.Provider value={context}>{children}</APIContext.Provider>;
}

const APIContext = createContext({});
export const useAPI = () => useContext(APIContext);
