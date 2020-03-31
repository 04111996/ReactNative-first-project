const appConfig = {
  "dev": {
    "clientId": "7781511129926994",
    "clientSecret": "31924d673785907e1c1d4f44119005fd40c1ff7cd6eb6040",
    "authorizationKey": "AAAAbJwfSCY:APA91bHgdUPHecMcW2FKLXtdBuEtYNS9l_t5qD6aeWU_WhujMkYOQlMPudRj2GG5tpC4B2iG8C9fHaK2_KtrIcojbjzmrbT0mg3fl1fA91mxMNLCqC-9kivDd4AKWp1d54FFJC9soK4u",
    "baseUrl": "https://",
    "env":"dev"
  },
  "prod": {
    "clientId": "3778093931592958",
    "clientSecret": "b19e46e26999cc4da3bba3982fd3dc53cc0227e9cf1a3dad",
    "authorizationKey": "AAAASHofgDA:APA91bEaTi_XfZPPdt5J81ni3QZpJsOx-K0riwdTN7ufTmlQePo-Mf-9QHi5Zd8lW7iaeChENQIiDeQyJw-6ALVYstTej9iXfpkdERMEjytXb_uUo4HR0gK2eD_8CkHRmT2e3POaYzNe",
    "baseUrl": "https://rest",
    "baseUrl2": "https://rest",
    "env":"prod"
  },
  "preprod": {
    "clientId": "5004042249412059",
    "clientSecret": "8c948141492929f89c625c63448cfbf5b89f1a580eedbafb",
    "authorizationKey": "AAAASHofgDA:APA91bEaTi_XfZPPdt5J81ni3QZpJsOx-K0riwdTN7ufTmlQePo-Mf-9QHi5Zd8lW7iaeChENQIiDeQyJw-6ALVYstTej9iXfpkdERMEjytXb_uUo4HR0gK2eD_8CkHRmT2e3POaYzNe",
    "baseUrl": "https://staging-rest",
    "env":"preprod"
  }
}

export function getEnvConfig() {
  // const location = window.location.href;
  const domain = ''
  const LOCAL_REGEX = new RegExp(/localhost[\w]*/);
  const DEV_REGEX = new RegExp(/dev[\w]*/);
  const QA_REGEX = new RegExp(/qa[\w]*/);
  const PREPROD_REGEX = new RegExp(/preprod[\w]*/);
  const PROD_REGEX = new RegExp(/digitize[\w]*/);
  const AWS_REGEX = new RegExp(/aws[\w]*/);
  let environmentConfig = Object.assign({}, appConfig.dev);

  if (QA_REGEX.test(domain) || AWS_REGEX.test(domain)) {
    const qaEnv = domain.split('-')[0];
    environmentConfig.baseUrl = `https://${qaEnv}-.com/api`;
    environmentConfig.baseUrl2 = `https://${qaEnv}-.com/api`;
    environmentConfig.baseUrl3 = `https://${qaEnv}-e.com`;
    environmentConfig.mlrestBaseUrl = `https://${qaEnv}-svc.com/rest-services`;
    environmentConfig.env = "qa";
  } else if (DEV_REGEX.test(domain) || AWS_REGEX.test(domain)) {
    const devEnv = domain.split('-')[0];
    environmentConfig.baseUrl = `https://${devEnv}-.com/api`;
    environmentConfig.baseUrl2 = `https://${devEnv}-.com/api`;
    environmentConfig.baseUrl3 = `https://${devEnv}-.com`;
    environmentConfig.mlrestBaseUrl = `https://${devEnv}-svc./rest-services`;
    environmentConfig.env = "dev";
  } else if (LOCAL_REGEX.test(domain) || AWS_REGEX.test(domain)) {
    // const devEnv = domain.split('-')[0];
    environmentConfig.baseUrl = 'http://localhost:5002/api';
    environmentConfig.baseUrl2 = 'http://localhost:5002/api';
    environmentConfig.baseUrl3 = 'http://localhost:5002';
    environmentConfig.mlrestBaseUrl = 'https://localhost:5002/rest-services';
    environmentConfig.env = "local";
  } else if (PREPROD_REGEX.test(domain) || AWS_REGEX.test(domain)) {
    environmentConfig = Object.assign({}, appConfig.preprod);
    environmentConfig.baseUrl = 'https://preprod-.com/api';
    environmentConfig.baseUrl2 = 'https://preprod-internal-.com/api';
    environmentConfig.baseUrl3 = 'https://preprod-.com';
    environmentConfig.mlrestBaseUrl = 'https://preprod-svc.com/rest-services';
    environmentConfig.env = "preprod";
  } else if (PROD_REGEX.test(domain) || AWS_REGEX.test(domain)) {
    environmentConfig = Object.assign({}, appConfig.prod);
    environmentConfig.baseUrl = 'https://.com/api';
    environmentConfig.baseUrl2 = 'https://internal.com/api';
    environmentConfig.baseUrl3 = 'https://.com';
    environmentConfig.mlrestBaseUrl = 'https://svc.com/rest-services';
    environmentConfig.env = "prod";
  }
  return environmentConfig;
}

