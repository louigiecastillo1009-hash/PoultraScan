import { useState, useCallback, useRef } from 'react';
import { createScanSession } from '../pages/ai-scan/api/scanSession'; // adjust path
import { countChickens } from '../pages/ai-scan/api/detection'; // adjust path
import { predictDisease } from '../pages/ai-scan/api/aiPrediction'; // adjust path
import { useScanCache, fileToBase64 } from '../pages/ai-scan/hooks/useScanCache'; // adjust path

const DEFAULT_IMAGE_TYPE = 'FRONT';
const SEVERITY_RANK = { HIGH: 3, MEDIUM: 2, LOW: 1, NONE: 0, UNKNOWN: 0 };

function summarize(predictionData) {
  const chickens = predictionData?.chickens ?? [];

  if (chickens.length === 0) {
    return {
      chickenCount: 0,
      healthyCount: 0,
      topDisease: null,
      topSeverity: null,
      unavailableMessage: predictionData?.quota_message,
    };
  }

  let worst = chickens[0];
  for (const c of chickens) {
    const rank = SEVERITY_RANK[c.severity?.toUpperCase()] ?? 0;
    const worstRank = SEVERITY_RANK[worst.severity?.toUpperCase()] ?? 0;
    if (rank > worstRank) worst = c;
  }

  return {
    chickenCount: chickens.length,
    healthyCount: chickens.filter((c) => c.healthy).length,
    topDisease: worst.disease,
    topSeverity: worst.severity,
    unavailableMessage: predictionData.quota_message,
  };
}

export function useQuickScan(farmId) {
  const submitting = useRef(false);
  const [status, setStatus] = useState('idle'); // idle | processing | done | error
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  const { saveCache } = useScanCache(farmId);

  const runQuickScan = useCallback(async (file, scanType) => {
    if (submitting.current) return;
    submitting.current = true;
    setStatus('processing');
    setError(null);
    setSummary(null);

    try {
      const sessionResult = await createScanSession({ farmId, scanType });
      const scanSessionId = sessionResult.session.id;

      const detectionResult = await countChickens({ scanSessionId, imageFile: file });
      const predictionResult = await predictDisease({ scanSessionId, imageType: DEFAULT_IMAGE_TYPE });

      // Save under the SAME cache key AiScan.jsx reads on mount, so tapping
      // "More Info" lands on /scan with the result already there — no re-scan.
      const base64Preview = await fileToBase64(file);
      saveCache({
        previewUrl: base64Preview,
        detectionData: detectionResult,
        predictionData: predictionResult,
      });

      const quickSummary = summarize(predictionResult);
      setSummary(quickSummary);
      setStatus('done');
      return quickSummary;
    } catch (err) {
      setError(err.message || 'Scan failed. Please try again.');
      setStatus('error');
    } finally {
      submitting.current = false;
    }
  }, [farmId, saveCache]);

  const reset = useCallback(() => {
    setStatus('idle');
    setSummary(null);
    setError(null);
  }, []);

  return { status, summary, error, runQuickScan, reset };
}
