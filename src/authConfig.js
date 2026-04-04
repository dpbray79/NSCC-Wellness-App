const isProduction = import.meta.env.MODE === 'production';
export const msalConfig = {
    auth: {
        clientId: "397d85f9-6314-4b12-8efa-d43430c38876",
        authority: "https://login.microsoftonline.com/0dc25d87-cd68-49b9-91ae-0ffc56d1eb24",
        redirectUri: isProduction ? "https://nscc-wellness.azurestaticapps.net" : "http://localhost:5173", // Primary: Azure SWA
    },
    cache: {
        cacheLocation: "sessionStorage", //or localStorage
        storeAuthStateInCookie: false,
    },
};

export const msalRequest = {
    scopes: ["api://e288605f-dee5-446f-8aba-2a968b330a1f/user_access"]
};
