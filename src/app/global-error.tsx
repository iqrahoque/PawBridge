"use client";

/**
 * Custom global-error — replaces Next's internal /_global-error page.
 * The built-in one trips a prerender invariant during static export
 * ("Expected workUnitAsyncStorage to have a store") on fresh installs.
 * Keeping it minimal + static makes EXPORT_MODE builds deterministic.
 */

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          fontFamily: "system-ui, sans-serif",
          background: "#FFF9F2",
          color: "#26332C",
        }}
      >
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>
          Something went wrong
        </h1>
        <p style={{ margin: 0, color: "#7B5E3B", fontSize: 14 }}>
          PawBridge hit an unexpected error. Please reload the page.
        </p>
        {error?.digest ? (
          <p style={{ margin: 0, color: "#6e6659", fontSize: 12 }}>
            Error ID: {error.digest}
          </p>
        ) : null}
      </body>
    </html>
  );
}
