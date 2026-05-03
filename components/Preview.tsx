'use client';

import { useEffect, useRef, useMemo } from 'react';

interface PreviewProps {
  code: string;
  id?: string;
}

export default function Preview({ code, id = 'preview-iframe' }: PreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const srcDoc = useMemo(() => {
    // Strip any script tags for security
    const sanitized = code.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  html, body { width: 400px; height: 300px; overflow: hidden; background: #fff; margin: 0; padding: 0; }
</style>
</head>
<body>
${sanitized}
</body>
</html>`;
  }, [code]);

  return (
    <div className="w-full h-full bg-white relative overflow-hidden">
      <iframe
        id={id}
        ref={iframeRef}
        srcDoc={srcDoc}
        sandbox="allow-same-origin"
        title="CSS Preview"
        className="w-full h-full border-0"
        style={{ background: '#fff' }}
      />
    </div>
  );
}
