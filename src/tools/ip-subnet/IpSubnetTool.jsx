import { useMemo, useState } from 'react';
import ToolShell from '../../components/ToolShell.jsx';
import CodeBlock from '../../components/CodeBlock.jsx';

function parseIp(value) {
  const parts = value.trim().split('.');
  if (parts.length !== 4) return null;
  const numbers = parts.map((part) => Number(part));
  if (numbers.some((num) => Number.isNaN(num) || num < 0 || num > 255)) return null;
  return numbers;
}

function ipToInt(parts) {
  return (
    ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0
  );
}

function intToIp(value) {
  return [
    (value >>> 24) & 255,
    (value >>> 16) & 255,
    (value >>> 8) & 255,
    value & 255,
  ].join('.');
}

function intToBinary(value) {
  const bits = (value >>> 0).toString(2).padStart(32, '0');
  return bits.match(/.{1,8}/g).join('.');
}

function classifyIp(firstOctet) {
  if (firstOctet >= 1 && firstOctet <= 126) return 'Class A';
  if (firstOctet >= 128 && firstOctet <= 191) return 'Class B';
  if (firstOctet >= 192 && firstOctet <= 223) return 'Class C';
  if (firstOctet >= 224 && firstOctet <= 239) return 'Class D (Multicast)';
  return 'Class E (Reserved)';
}

function getSpecialRanges(ip) {
  const [a, b] = ip;
  if (a === 10) return 'Private (10.0.0.0/8)';
  if (a === 172 && b >= 16 && b <= 31) return 'Private (172.16.0.0/12)';
  if (a === 192 && b === 168) return 'Private (192.168.0.0/16)';
  if (a === 127) return 'Loopback (127.0.0.0/8)';
  if (a === 169 && b === 254) return 'Link-local (169.254.0.0/16)';
  if (a >= 224 && a <= 239) return 'Multicast (224.0.0.0/4)';
  if (a >= 240) return 'Reserved (240.0.0.0/4)';
  return 'Public';
}

export default function IpSubnetTool() {
  const [ip, setIp] = useState('192.168.1.42');
  const [cidr, setCidr] = useState(24);

  const analysis = useMemo(() => {
    const parsed = parseIp(ip);
    const cidrNum = Number(cidr);

    if (!parsed) {
      return { error: 'Invalid IPv4 address.' };
    }

    if (Number.isNaN(cidrNum) || cidrNum < 0 || cidrNum > 32) {
      return { error: 'CIDR must be between 0 and 32.' };
    }

    const ipInt = ipToInt(parsed);
    const mask = cidrNum === 0 ? 0 : ((0xffffffff << (32 - cidrNum)) >>> 0);
    const network = ipInt & mask;
    const broadcast = network | (~mask >>> 0);
    const wildcardMask = (~mask) >>> 0;
    const hostBits = 32 - cidrNum;

    const totalHosts = cidrNum === 32 ? 1 : 2 ** (32 - cidrNum);
    const usableHosts = cidrNum >= 31 ? 0 : Math.max(0, totalHosts - 2);

    const firstHost = cidrNum >= 31 ? network : network + 1;
    const lastHost = cidrNum >= 31 ? broadcast : broadcast - 1;

    return {
      ip,
      cidr: cidrNum,
      hostBits,
      class: classifyIp(parsed[0]),
      rangeType: getSpecialRanges(parsed),
      subnetMask: intToIp(mask >>> 0),
      wildcardMask: intToIp(wildcardMask),
      networkAddress: intToIp(network >>> 0),
      broadcastAddress: intToIp(broadcast >>> 0),
      firstHost: usableHosts ? intToIp(firstHost >>> 0) : 'N/A',
      lastHost: usableHosts ? intToIp(lastHost >>> 0) : 'N/A',
      totalHosts,
      usableHosts,
      binary: {
        ip: intToBinary(ipInt),
        subnetMask: intToBinary(mask >>> 0),
        wildcardMask: intToBinary(wildcardMask),
        network: intToBinary(network >>> 0),
        broadcast: intToBinary(broadcast >>> 0),
      },
    };
  }, [cidr, ip]);

  return (
    <ToolShell
      title="IP & Subnet Analyzer"
      description="Analyze IPv4 addresses, CIDR blocks, and usable ranges."
      controls={
        <input
          type="number"
          min="0"
          max="32"
          value={cidr}
          onChange={(event) => setCidr(event.target.value)}
          className="ui-select w-24"
        />
      }
      input={
        <label className="flex h-full flex-col gap-2">
          <span className="ui-label">IPv4 Address</span>
          <input
            value={ip}
            onChange={(event) => setIp(event.target.value)}
            className="field-input"
            placeholder="192.168.1.1"
          />
        </label>
      }
      output={
        analysis?.error ? (
          <span className="text-red-700">{analysis.error}</span>
        ) : (
          <CodeBlock text={JSON.stringify(analysis, null, 2)} />
        )
      }
      outputCopyText={analysis?.error ? '' : JSON.stringify(analysis, null, 2)}
      outputCopyDisabled={Boolean(analysis?.error)}
    />
  );
}
