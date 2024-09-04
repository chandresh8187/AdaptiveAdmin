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

  let config = {
    method: body ? "POST" : "GET",
    ...customConfig,
    headers: {
      ...headers,
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
      const response = await fetch(serverURL + endpoint, config);
      console.log("api response", response);

      if (!response.ok && response.status !== 200) {
        setLoading(false);
        jsonRes = {
          ...jsonRes,
          status: response.status,
          message: "Request failed with status code : " + response.status,
        };
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
      reject(error); // Reject the original promise on error
    }
  });
};

// Clear the queue after processing

APIClient.get = function (endpoint, customConfig = {}) {
  return APIClient(endpoint, { ...customConfig, method: "GET" });
};
APIClient.post = function (endpoint, body) {
  var customConfig = {};
  return APIClient(endpoint, { ...customConfig, body });
};
