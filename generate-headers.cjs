const fs = require("fs");
const allowedOrigins = [
  "https://nhexa.cl",
  "https://laruina.cl",
  "https://elumbral.cl",
  "https://terminalcore.cl",
  "https://terminalkiller.cl",
  "https://spectra.nhexa.cl",
  "https://spellcast.nhexa.cl",
  "https://havenstore.nhexa.cl",
  "https://streamby.nhexa.cl",
];

// Generar la configuración de `X-Frame-Options` y `Content-Security-Policy`
const headersContent = `
/*
  X-Frame-Options: ALLOW-FROM ${allowedOrigins.join(" ")}
  Content-Security-Policy: frame-ancestors ${allowedOrigins.join(" ")}
`;

// Escribir el archivo `_headers` en la raíz del proyecto
fs.writeFileSync("_headers", headersContent);

console.log("✅ Archivo _headers generado exitosamente.");
