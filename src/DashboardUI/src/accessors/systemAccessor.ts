import axios from "axios";

export const getBeneficialUses = async (): Promise<string[]> => {
  const url = new URL('system/beneficialuses', process.env.REACT_APP_WEBAPI_URL);
  const { data } = await axios.get<string[]>(
    url.toString()
  );
  return data;
};

export const getOwnerClassifications = async (): Promise<string[]> => {
  const url = new URL('system/ownerclassifications', process.env.REACT_APP_WEBAPI_URL);
  const { data } = await axios.get<string[]>(
    url.toString()
  );
  return data;
};

export const getWaterSourceTypes = async (): Promise<string[]> => {
  const url = new URL('system/watersourcetypes', process.env.REACT_APP_WEBAPI_URL);
  const { data } = await axios.get<string[]>(
    url.toString()
  );
  return data;
};

export const getStates = async (): Promise<string[]> => {
  const url = new URL('system/states', process.env.REACT_APP_WEBAPI_URL);
  const { data } = await axios.get<string[]>(
    url.toString()
  );
  return data;
};