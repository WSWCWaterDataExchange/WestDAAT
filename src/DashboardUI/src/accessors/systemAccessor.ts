import axios from "axios";

export const getBeneficialUses = async (): Promise<string[]> => {
  const url = new URL('api/system/beneficialuses', process.env.REACT_APP_WEBAPI_URL);
  const { data } = await axios.get<string[]>(
    url.toString()
  );
  return data;
};

export const getOwnerClassifications = async (): Promise<string[]> => {
  const url = new URL('api/system/ownerclassifications', process.env.REACT_APP_WEBAPI_URL);
  const { data } = await axios.get<string[]>(
    url.toString()
  );
  return data;
};

export const getWaterSourceTypes = async (): Promise<string[]> => {
  const url = new URL('api/system/watersourcetypes', process.env.REACT_APP_WEBAPI_URL);
  const { data } = await axios.get<string[]>(
    url.toString()
  );
  return data;
};