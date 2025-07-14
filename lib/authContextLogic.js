import axios from "axios";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../firebase";

// To retry any failed fetch
export async function retry(fn, maxTries = 3, delayMs = 0, on401) {
  let lastErr;

  for (let attempt = 1; attempt <= maxTries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (err?.response?.status === 401) {
        on401?.();
        return;
      }
      lastErr = err;
      if (attempt < maxTries && delayMs) {
        await new Promise((res) => setTimeout(res, delayMs));
      }
    }
  }

  throw lastErr;
}

export async function fetchUser({ domain, setUser, verifyOffer, on401 }) {
  const token = localStorage?.getItem?.("accessToken");
  if (!token) return on401?.();

  const response = await axios.get(`${domain}/users/current-user`, {
    headers: { accessToken: token },
  });

  const user = response?.data?.user;
  setUser?.(user);
  await verifyOffer?.(user);
  return user;
}

export async function verifyOffer({
  user,
  domain,
  setUser,
  fetchOffer,
  fetchProfilePicture,
  on401,
}) {
  if (!user?.purchasedOffer?.offer) {
    await fetchProfilePicture?.(user);
    return;
  }

  const data = {
    username: user?.username,
    expirationDate: user?.purchasedOffer?.EndsAt,
  };

  const response = await axios.post(`${domain}/subscribers/check-offer`, data);

  if (response?.data?.newUser) {
    setUser?.(response?.data?.newUser);
    await fetchProfilePicture?.(response?.data?.newUser);
  } else if (response?.data?.notExpired) {
    await fetchOffer?.(user);
  }
}

export async function fetchOffer({
  user,
  domain,
  setPurchasedOffer,
  fetchOrders,
  on401,
}) {
  const response = await axios.post(`${domain}/subscribers/current-offer`, {
    userId: user?._id,
  });

  setPurchasedOffer?.(response?.data?.offer);
  await fetchOrders?.(user);
}

export async function fetchOrders({
  user,
  domain,
  setOrders,
  fetchProfilePicture,
  on401,
}) {
  const token = localStorage?.getItem?.("accessToken");

  const response = await axios.get(`${domain}/orders/${user?._id}`, {
    headers: { accessToken: token },
  });

  setOrders?.(response?.data?.sheets);
  await fetchProfilePicture?.(user);
}

export async function fetchProfilePicture({
  user,
  domain,
  setImageUrl,
  onLogin,
  on401,
}) {
  if (!user?.profilePic) {
    const imageRef = ref(storage, `defaults/profilePic/noProfilePic.png`);
    const url = await getDownloadURL(imageRef);

    const config = {
      headers: {
        accessToken: localStorage?.getItem?.("accessToken") || "",
      },
    };

    await axios.patch(
      `${domain}/users/profile-picture`,
      { path: url, pfp: true },
      config
    );
    setImageUrl?.(url);
  } else {
    setImageUrl?.(user?.profilePic);
  }
  onLogin?.();
}
