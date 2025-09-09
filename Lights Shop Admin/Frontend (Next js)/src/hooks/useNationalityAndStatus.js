import { useState, useCallback } from "react";
import { fetchNationalities, fetchStatus } from "@/api";

export const useDealerFormOptions = () => {
  const [nationalityOptions, setNationalityOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [loading, setLoading] = useState({
    nationalities: false,
    status: false,
  });

  const fetchNationality = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, nationalities: true }));
    } catch (error) {
      console.error("Error fetching nationalities:", error);
    } finally {
      setLoading((prev) => ({ ...prev, nationalities: false }));
    }
  }, []);

  const fetchStatusOptions = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, status: true }));
      const res = await fetchStatus();
      setStatusOptions(res?.data?.data || []);
    } catch (error) {
      console.error("Error fetching status:", error);
    } finally {
      setLoading((prev) => ({ ...prev, status: false }));
    }
  }, []);

  return {
    nationalityOptions,
    statusOptions,
    loading,
    fetchNationality,
    fetchStatusOptions,
  };
};
