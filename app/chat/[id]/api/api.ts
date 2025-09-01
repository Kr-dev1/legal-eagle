import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getContract = async () => {
  const result = await axios.get("/api/contracts");
  return result.data;
};

export const useGetContracts = () => {
  return useQuery({
    queryKey: ["contracts"],
    queryFn: getContract,
    staleTime: Infinity,
    gcTime: 1000000,
    refetchOnWindowFocus: false,
  });
};
