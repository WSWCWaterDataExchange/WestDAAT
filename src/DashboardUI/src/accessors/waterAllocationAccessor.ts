import { waterRightDetails } from '@data-contracts';
import axios from 'axios';

export const getWaterRightDetails = async (waterRightId: number) => {
  const { data } = await axios.get<waterRightDetails>(
    `${process.env.REACT_APP_WEBAPI_URL}/GetWaterRightDetails/${waterRightId}`
  );
  return data;
};
