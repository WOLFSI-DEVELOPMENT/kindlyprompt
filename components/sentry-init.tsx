'use client';

import * as Sentry from "@sentry/react";

if (typeof window !== 'undefined') {
  Sentry.init({
    dsn: "https://2422db4b08734f7b871408fa92e03a62@o4510525329768448.ingest.us.sentry.io/4510525331668992",
    sendDefaultPii: true
  });
}

export function SentryInit() {
  return null;
}
