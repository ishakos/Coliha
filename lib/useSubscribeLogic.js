import axios from "axios";

export async function retry(fn, maxTries = 3, delayMs = 0, on401) {
  let lastErr;

  for (let attempt = 1; attempt <= maxTries; attempt++) {
    try {
      return await fn?.();
    } catch (err) {
      if (err?.response?.status === 401) {
        on401?.();
        return;
      }
      lastErr = err;
      if (attempt < maxTries && delayMs > 0) {
        await new Promise((res) => setTimeout(res, delayMs));
      }
    }
  }

  throw lastErr;
}

export async function checkFeatureAccess({ domain, currentPage, offerId }) {
  const config = {
    headers: {
      currentPage,
      offerId: offerId ?? "",
      accessToken: localStorage?.getItem?.("accessToken") ?? "",
    },
  };

  return await axios?.post?.(`${domain}/subscribers/check-access`, {}, config);
}
