import phin from 'phin';
import { MetaDetail } from 'stremio-addon-sdk';
import { streamingServerUrl } from './constants';

export interface File {
  length: number;
  name: string;
  offset: number;
  path: string;
}

export interface Source {
  /**
   * datetime string
   */
  lastStarted: string;
  numFound: number;
  numFoundUniq: number;
  numRequests: number;
  /**
   * dht:<infoHash>
   */
  url:string;
}

export interface EngineOptions {
  connections: number;
  dht: boolean;
  flood: boolean;
  growler: {
    flood: number;
    pulse: number;
  };
  handshakeTimeout: number;
  id: string;
  /**
   * cached file path
   */
  path: string;
  peerSearch: {
    max: number;
    min: number;
    sources: string[];
  };
  pulse: number;
  swarmCap: {
    maxSpeed: number;
    minPeers: number;
  };
  timeout: number;
  tracker: boolean;
  virtual: boolean;
}

export interface CreatedEngine {
  connectionTries: number;
  downloaded: number;
  downloadSpeed: number;
  files: File[];
  infoHash: string;
  /**
   * name of the file (including extension)
   */
  name: string;
  opts: Object;
  peers: number;
  peerSearchRunning: boolean;
  queued: number;
  selections: any;
  sources: Source[];
  swarmConnections: number;
  swarmPaused: boolean;
  swarmSize: number;
  unchoked: number;
  unique: number;
  uploaded: number;
  uploadSpeed: number;
  wires: any;
}

export default async function createEngine(infoHash: string, announce?: string[]) {
  const response = await phin({
    url: `${streamingServerUrl}/${infoHash}/create`,
    data: JSON.stringify({
      peerSearch: {
        max: 150,
        min: 40
      },
      sources: [
        'dht:' + infoHash,
        ...(announce || []).map(source => 'tracker:' + source)
      ]
    })
  });

  return JSON.parse(response.body) as CreatedEngine;
}

export async function fetchMeta(infoHash: string) {
  const response = await phin(`${streamingServerUrl}/local-addon/meta/other/bt:${infoHash}.json`);
  return JSON.parse(response.body) as {meta: MetaDetail};
}
