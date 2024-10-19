import { setLoading } from "./LoadingManager";

export const APIClient = async (endpoint, { body, ...customConfig } = {}) => {
  const serverURL = "https://adaptiveielts.com:8383/";
  const headers = {};
  setLoading(true);

  let logData = {
    endpoint: endpoint,
    body: body,
  };

  console.log("API ---> ", JSON.stringify(logData));
  let xapikey = localStorage.getItem("xapikey");
  let config = {
    method: body ? "POST" : "GET",
    ...customConfig,
    headers: {
      ...headers,
      "X-API-KEY": xapikey,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  return new Promise(async (resolve, reject) => {
    // proceed with the fetch
    let jsonRes = {
      data: [],
      ok: false,
      status: "",
    };
    try {
      const response = await fetch(serverURL + endpoint, {
        ...config,
        credentials: "include",
      });

      if (!response.ok && response.status !== 200) {
        setLoading(false);
        jsonRes = {
          ...jsonRes,
          status: response.status,
          message: "Request failed with status code : " + response.status,
        };
        console.log("await response.json()", await response.json());
        resolve(jsonRes);
        console.error("something went wrong please try again ok false");
        return;
      } else {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const jsonResponse = await response.json();
          jsonRes = {
            data: jsonResponse,
            ok: response.ok,
            status: response.status,
            message: "",
          };
          setLoading(false);
          resolve(jsonRes);
        } else {
          jsonRes = {
            data: [],
            ok: response.ok,
            status: response.status,
            message: "",
          };
          setLoading(false);
          resolve(jsonRes);
        }
      }
    } catch (error) {
      setLoading(false);
      jsonRes = {
        data: [],
        ok: false,
        status: "",
        message: `${error}`,
      };
      resolve(jsonRes);
      console.error("API call error:", error);
      reject(error);
    }
  });
};

APIClient.get = function (endpoint, customConfig = {}) {
  return APIClient(endpoint, { ...customConfig, method: "GET" });
};
APIClient.post = function (endpoint, body = {}) {
  var customConfig = {};
  return APIClient(endpoint, { ...customConfig, body });
};

export const session = async (Token, endpoint, method) => {
  const serverURL = "https://adaptiveielts.com:8383/";
  let config = {
    method: method,
    headers: {
      Authorization: `Bearer ${Token}`,
    },
  };

  try {
    const response = await fetch(serverURL + endpoint, {
      ...config,
      credentials: "include",
    });
    console.log("session response", response);
    console.log("session response json", await response.json());
    if (response.ok && response.status === 200) {
      const xapikey = response.headers.get("x-api-key");
      localStorage.setItem("xapikey", xapikey);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("session error", error);
    return false;
  }
};

session.register = async function (Token) {
  return session(Token, "register", "POST");
};

session.start = async function (Token) {
  return session(Token, "session", "GET");
};
