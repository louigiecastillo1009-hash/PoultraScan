import { useCallback, useEffect, useRef, useState } from 'react';

import {
  fetchRegions,
  fetchProvinces,
  fetchRegionCitiesMunicipalities,
  fetchProvinceCitiesMunicipalities,
  fetchBarangays,
} from '../../../api/psgcApi';

const IDLE = { loading: false, error: null };
const LOADING = { loading: true, error: null };

/**
 * Manages the cascading Region -> Province -> City/Municipality ->
 * Barangay selection using the PSA PSGC hierarchy.
 *
 * Hierarchical rules encoded here (verified against the live API):
 *  - Most regions have provinces; the city/municipality list comes from
 *    the selected PEROVI province.
 *  - NCR has NO provinces (its endpoint returns an empty list) and its
 *    cities/municipalities are listed directly at region level, so the
 *    province step is skipped entirely.
 *  - Every dependent selection is cleared whenever a parent changes, so a
 *    barangay can never linger under a different municipality.
 */
export function useFarmLocation() {
  // Selections
  const [region, setRegion] = useState(null);
  const [province, setProvince] = useState(null);
  const [city, setCity] = useState(null);
  const [barangay, setBarangay] = useState(null);
  const [details, setDetails] = useState('');

  // Option lists (already normalized + alphabetically sorted in psgcApi)
  const [regions, setRegions] = useState([]);
  const [provinceList, setProvinceList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [barangayList, setBarangayList] = useState([]);

  // `provincesApplicable` stays false until a region is picked and its
  // province data says otherwise (NCR -> false forever).
  const [provincesApplicable, setProvincesApplicable] = useState(false);

  // Request states per level
  const [regionsState, setRegionsState] = useState(IDLE);
  const [regionDataState, setRegionDataState] = useState(IDLE);
  const [cityState, setCityState] = useState(IDLE);
  const [barangayState, setBarangayState] = useState(IDLE);

  // Stale-response guards: a selection that changed mid-request must never
  // be overwritten by the older request's data.
  const regionReqId = useRef(0);
  const cityReqId = useRef(0);
  const barangayReqId = useRef(0);

  const loadRegions = useCallback(async () => {
    setRegionsState(LOADING);
    try {
      const list = await fetchRegions();
      setRegions(list);
      setRegionsState(IDLE);
    } catch (err) {
      setRegionsState({
        loading: false,
        error: err?.message || 'Unable to load locations. Please try again.',
      });
    }
  }, []);

  useEffect(() => {
    loadRegions();
  }, [loadRegions]);

  /**
   * Selecting a region: clears everything below it, then loads the region's
   * provinces and region-level cities in ONE parallel pass.
   */
  const changeRegion = useCallback(async (option) => {
    setRegion(option);
    setProvince(null);
    setCity(null);
    setBarangay(null);
    setDetails('');
    setProvinceList([]);
    setProvincesApplicable(false);
    setCityList([]);
    setBarangayList([]);
    setCityState(IDLE);
    setBarangayState(IDLE);

    if (!option) {
      setRegionDataState(IDLE);
      return;
    }

    const reqId = ++regionReqId.current;
    setRegionDataState(LOADING);
    try {
      // Province list is used solely to decide whether the province step
      // exists; the region-level LGU list backs this region only when the
      // region has no provinces (NCR).
      const [provinces, regionCities] = await Promise.all([
        fetchProvinces(option.code),
        fetchRegionCitiesMunicipalities(option.code),
      ]);
      if (regionReqId.current !== reqId) return; // stale

      const applicable = provinces.length > 0;
      setProvinceList(provinces);
      setProvincesApplicable(applicable);
      setCityList(applicable ? [] : regionCities);
      setRegionDataState(IDLE);
    } catch (err) {
      if (regionReqId.current !== reqId) return; // stale
      setRegionDataState({
        loading: false,
        error: err?.message || 'Unable to load locations. Please try again.',
      });
    }
  }, []);

  /**
   * Selecting a province: clears city/municipality + barangay, then loads
   * the province's cities and municipalities.
   */
  const changeProvince = useCallback(async (option) => {
    setProvince(option);
    setCity(null);
    setBarangay(null);
    setCityList([]);
    setBarangayList([]);
    setBarangayState(IDLE);

    if (!option) {
      setCityState(IDLE);
      return;
    }

    const reqId = ++cityReqId.current;
    setCityState(LOADING);
    try {
      const list = await fetchProvinceCitiesMunicipalities(option.code);
      if (cityReqId.current !== reqId) return; // stale
      setCityList(list);
      setCityState(IDLE);
    } catch (err) {
      if (cityReqId.current !== reqId) return; // stale
      setCityState({
        loading: false,
        error: err?.message || 'Unable to load locations. Please change province to retry.',
      });
    }
  }, []);

  /**
   * Selecting a city/municipality: clears the barangay, then loads that
   * LGU's barangays.
   */
  const changeCity = useCallback(async (option) => {
    setCity(option);
    setBarangay(null);
    setBarangayList([]);

    if (!option) {
      setBarangayState(IDLE);
      return;
    }

    const reqId = ++barangayReqId.current;
    setBarangayState(LOADING);
    try {
      const list = await fetchBarangays(option.code);
      if (barangayReqId.current !== reqId) return; // stale
      setBarangayList(list);
      setBarangayState(IDLE);
    } catch (err) {
      if (barangayReqId.current !== reqId) return; // stale
      setBarangayState({
        loading: false,
        error: err?.message || 'Unable to load barangays. Please change municipality to retry.',
      });
    }
  }, []);

  const changeBarangay = useCallback((option) => {
    setBarangay(option);
  }, []);

  const retryRegionData = useCallback(() => {
    // Refresh the failed region-level request (provinces + region LGUs).
    if (region) changeRegion(region);
    else loadRegions();
  }, [region, changeRegion, loadRegions]);

  /**
   * True when the user has completed a full valid selection.
   */
  const isComplete = Boolean(
    region &&
      city &&
      barangay &&
      (!provincesApplicable || province) &&
      !regionDataState.loading &&
      !cityState.loading &&
      !barangayState.loading
  );

  return {
    // selections
    region,
    province,
    city,
    barangay,
    details,
    // option lists
    regions,
    provinceList,
    cityList,
    barangayList,
    provincesApplicable,
    // request states
    regionsState,
    regionDataState,
    cityState,
    barangayState,
    // handlers
    changeRegion,
    changeProvince,
    changeCity,
    changeBarangay,
    setDetails,
    retryRegionData,
    // helpers
    isComplete,
  };
}

/**
 * Composes the selected administrative hierarchy + free-text details into
 * the single address string the existing backend stores in farm.location.
 * Example: "Purok 2, San Teodoro, Bauan, Batangas, Region IV-A (CALABARZON)"
 * Empty values are skipped; stray whitespace is trimmed.
 */
export function composeFarmAddress({ region, province, city, barangay, details }) {
  return [details, barangay?.name, city?.name, province?.name, region?.name]
    .map((part) => (typeof part === 'string' ? part.trim() : ''))
    .filter(Boolean)
    .join(', ');
}
