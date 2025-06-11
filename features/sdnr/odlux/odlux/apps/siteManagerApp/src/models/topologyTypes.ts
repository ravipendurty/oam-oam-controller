type Route = { lat: number; lon: number };

export type Service = {
  'id': number;
  'name': string;
  'type': string;
  'backupForServiceId': number | null;
  'lifecycleState': string;
  'administrativeState': string;
  'operationalState': string;
  'created': string;
  'modified': string;
  'route': Route[];
  'length': number;
};