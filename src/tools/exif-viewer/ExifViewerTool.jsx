import { useState } from 'react';
import exifr from 'exifr';
import ToolShell from '../../components/ToolShell.jsx';
import CodeBlock from '../../components/CodeBlock.jsx';

export default function ExifViewerTool() {
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setError('');
    setOutput('');
    setFileName(file.name);

    try {
      const metadata = await exifr.parse(file, {
        tiff: true,
        ifd0: true,
        exif: true,
        gps: true,
        xmp: true,
        icc: true,
        iptc: true,
      });

      const payload = {
        file: {
          name: file.name,
          type: file.type,
          sizeBytes: file.size,
          lastModified: file.lastModified,
        },
        metadata: metadata || {},
      };

      setOutput(JSON.stringify(payload, null, 2));
    } catch (err) {
      setError(err?.message || 'Unable to extract metadata.');
    } finally {
      event.target.value = '';
    }
  };

  return (
    <ToolShell
      title="EXIF / Metadata Viewer"
      description="Extract EXIF, GPS, and metadata from image files locally."
      controls={
        <label className="ui-btn cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
          Select Image
        </label>
      }
      input={
        <div className="ui-surface p-4 text-sm ui-muted">
          {fileName ? `Loaded: ${fileName}` : 'Choose an image file to inspect metadata.'}
        </div>
      }
      output={
        error ? (
          <span className="text-red-700">{error}</span>
        ) : output ? (
          <CodeBlock text={output} />
        ) : (
          <span className="ui-muted">Metadata output appears here.</span>
        )
      }
      outputCopyText={output}
      outputCopyDisabled={!output}
    />
  );
}
