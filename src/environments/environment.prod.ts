// site A

// const APIM_URL_LOGIN = "https://11.165.37.333:8243";
// const APIM_URL = "https://11.165.37.333:8243/service/1";

// const APIM_URL = "https://localhost:8243/service/1";
// const APIM_URL_LOGIN = "https://localhost:8243";

//localhost, site A and site B (different port and Http)

// const APIM_URL_LOGIN = "http://localhost:8280";
// const APIM_URL = "http://localhost:8280/service/1";

// const APIM_URL_LOGIN = "http://11.165.37.333:8280";
// const APIM_URL = "http://11.165.37.333:8280/service/1";

const APIM_URL_LOGIN = "http://11.165.37.333:8280";
const APIM_URL = "http://11.165.37.333:8280/service/1";

//site B

// const APIM_URL_LOGIN = "https://10.141.43.64:8243";
// const APIM_URL = "https://11.165.37.333:8243/service/1";

// const APIM_URL_LOGIN = "https://10.155.48.145:8243";
// const APIM_URL = "https://10.155.48.145:8243/service/1";

export const environment = {
  production: true,
  TOKEN_KEY: "access_token",
  REFRESH_TOKEN_KEY: "refresh_token",
  SCOPE_KEY: "scope",

  TOKEN_TYPE_KEY: "Bearer",
  EXPIRE_IN_KEY: "expires_in",
  TOKEN_EXPIRY: 3600,
  CONSUMER_KEY_SECRET:
    "WU1TSURLNHprSklDSVd4Q2VJVGxhWUVuV0I0YTpWdkxQdkt1dnpuU1JYMjRCOGFiMVhyc1Eycmdh",
  EncDecKey: "Enc_Verif_Hack",
  notificationTimer: 4000,
  title: "Prod",
  characterLimit: 300,
  apiRoutes: {
    loginUser: `${APIM_URL_LOGIN}/token`,
    getServiceCodes: `${APIM_URL}/getServiceCodes`,
    addServiceCode: `${APIM_URL}/addServiceCode`,
    updateServiceCode: `${APIM_URL}/updateServiceCode`,
    deleteServiceCode: `${APIM_URL}/deleteServiceCode`,
    getSubServiceCodes: `${APIM_URL}/getSubServiceCodes`,
    addSubServiceCodes: `${APIM_URL}/addSubServiceCodes`,
    updateSubServiceCodes: `${APIM_URL}/updateSubServiceCodes`,
    deleteSubServiceCodes: `${APIM_URL}/deleteSubServiceCodes`,
    getEsmeConfigurations: `${APIM_URL}/getEsmeConfigurations`,
    addEsmeConfiguration: `${APIM_URL}/addEsmeConfiguration`,
    updateEsmeConfiguration: `${APIM_URL}/updateEsmeConfiguration`,
    deleteEsmeConfiguration: `${APIM_URL}/deleteEsmeConfiguration`,
    addMenu: `${APIM_URL}/addMenu`,

    updateMenu: `${APIM_URL}/updateMenu`,

    getMenus: `${APIM_URL}/getMenus`,

    getMenuById: `${APIM_URL}/getMenuById`,
    dateWiseServices: `${APIM_URL}/dateWiseServices`,
    serviceCounts: `${APIM_URL}/serviceCounts`,
    deleteMenu: `${APIM_URL}/deleteMenu`,
    getProfile: `${APIM_URL}/getProfile`,
    esmeDetails: `${APIM_URL}/esmeDetails`,
    treeDetails: `${APIM_URL}/treeDetails`,
    addStringsBasedCharging: `${APIM_URL}/addStringsBasedCharging`,
    getStringsBasedCharging: `${APIM_URL}/getStringsBasedCharging`,
    editStringsBasedCharging: `${APIM_URL}/editStringsBasedCharging`,
    getExclusiveList: `${APIM_URL}/getExclusiveList`,
    addExclusiveList: `${APIM_URL}/addExclusiveList`,
    editExclusiveList: `${APIM_URL}/editExclusiveList`,
    deleteExclusiveList: `${APIM_URL}/deleteExclusiveList`,
    getNormalFlowCodes: `${APIM_URL}/getFlowCodes`,
    getDtmfsById: `${APIM_URL}/getDtmfsById`,
    getHttpSmppConf: `${APIM_URL}/getHttpSmppConf`,
    getWhiteListGroups: `${APIM_URL}/getWhiteListGroups`,
    getServiceCodeGroups: `${APIM_URL}/getServiceCodeGroups`,
    getMsisdnHistory: `${APIM_URL}/getMsisdnHistory`,
    deleteStringsBasedCharging: `${APIM_URL}/deleteStringsBasedCharging`,
    downloadMenus: `${APIM_URL}/downloadMenus`,
  },

  errorCode: {
    HTTP_REQUEST: {
      code: 1000,
      msg: "An http request failure",
    },
  },
};
