import { useCallback } from "react";
import { colorList } from "../config/constants";

const fallbackColor = "#000000";
export function useColorMappings() {
    const getColorByIndex = useCallback((i)=>{
      return colorList[i % colorList.length];
    }, []);

    return {getColorByIndex, fallbackColor}
}