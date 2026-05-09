/**
 * Load test upload + download (public link).
 *
 * Prérequis : API joignable, utilisateur de test existant.
 *
 * Usage :
 *   k6 run upload-test.js
 *   BASE_URL=http://localhost:8000 EMAIL=test@example.com PASSWORD=password k6 run upload-test.js
 *
 * Depuis la racine du repo :
 *   FIXTURE_PATH=perf/fixtures/sample-upload.txt k6 run perf/upload-test.js
 *
 * Variables d'environnement :
 *   BASE_URL      — origine API sans slash final (défaut: http://localhost:8000)
 *   EMAIL         — compte pour login (défaut: test@example.com)
 *   PASSWORD      — mot de passe (défaut: password)
 *   FIXTURE_PATH  — fichier pour multipart (défaut: ./fixtures/sample-upload.txt depuis le CWD)
 */

import http from "k6/http";
import { check, sleep } from "k6";
import { Trend, Counter } from "k6/metrics";

const uploadDuration = new Trend("upload_duration_ms", true);
const downloadDuration = new Trend("download_duration_ms", true);
const uploadFailures = Counter("upload_failures");
const downloadFailures = Counter("download_failures");

export const options = {
  vus: 5,
  duration: "30s",
  thresholds: {
    http_req_failed: ["rate<0.05"],
    upload_duration_ms: ["p(95)<5000"],
    download_duration_ms: ["p(95)<3000"],
  },
};

const BASE = __ENV.BASE_URL || "http://localhost:8000";
const API = `${BASE}/api`;
const EMAIL = __ENV.EMAIL || "test@example.com";
const PASSWORD = __ENV.PASSWORD || "password";
const FIXTURE_PATH = __ENV.FIXTURE_PATH || "./fixtures/sample-upload.txt";

function login() {
  const res = http.post(
    `${API}/login`,
    JSON.stringify({ email: EMAIL, password: PASSWORD }),
    { headers: { "Content-Type": "application/json" } }
  );
  const ok = check(res, {
    "login 200": (r) => r.status === 200,
    "login token": (r) => {
      try {
        return JSON.parse(String(r.body)).token !== undefined;
      } catch {
        return false;
      }
    },
  });
  if (!ok || res.status !== 200) {
    return null;
  }
  return JSON.parse(String(res.body)).token;
}

export default function () {
  const token = login();
  if (!token) {
    uploadFailures.add(1);
    return;
  }

  const bin = open(FIXTURE_PATH, "b");

  const uploadStart = Date.now();
  const up = http.post(
    `${API}/files`,
    { file: http.file(bin, "sample-upload.txt", "text/plain") },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  uploadDuration.add(Date.now() - uploadStart);

  const uploadOk = check(up, {
    "upload 201": (r) => r.status === 201,
  });
  if (!uploadOk) {
    uploadFailures.add(1);
    return;
  }

  let downloadUrl = "";
  try {
    const body = JSON.parse(String(up.body));
    downloadUrl = body.download_url || "";
  } catch {
    uploadFailures.add(1);
    return;
  }

  if (!downloadUrl) {
    uploadFailures.add(1);
    return;
  }

  const dlStart = Date.now();
  const dl = http.get(downloadUrl);
  downloadDuration.add(Date.now() - dlStart);

  const dlOk = check(dl, {
    "download 200": (r) => r.status === 200,
  });
  if (!dlOk) {
    downloadFailures.add(1);
  }

  sleep(1);
}
