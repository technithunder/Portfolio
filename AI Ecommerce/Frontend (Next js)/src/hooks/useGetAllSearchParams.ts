import { useSearchParams } from "next/navigation";

function useGetAllSearchParams() {
  const searchParams = useSearchParams();
  const params: { [key: string]: string[] } = {};

  searchParams.forEach((value, key) => {
    if (!params[key]) {
      params[key] = []; // Initialize as an array if it doesn't exist
    }
    params[key].push(value.replaceAll("-", " ")); // Push values instead of overwriting
  });

  return params;
}

export default useGetAllSearchParams;