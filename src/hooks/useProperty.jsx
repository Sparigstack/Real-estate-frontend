import { useContext } from "react";
import PropertyContext from "../context/PropertyContext";

const useProperty = () => {
    return useContext(PropertyContext);
}

export default useProperty;