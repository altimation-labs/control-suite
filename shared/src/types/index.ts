// Core Enums
export enum CoreType {
  EvoCore = 'EvoCore',
  TensoCore = 'TensoCore',
  NeuroCore = 'NeuroCore'
}

export enum TransportType {
  USB_SERIAL = 'USB_SERIAL',
  MAVLINK_TCP = 'MAVLINK_TCP',
  MAVLINK_UDP = 'MAVLINK_UDP',
  BLUETOOTH = 'BLUETOOTH',
  SIK_RADIO = 'SIK_RADIO'
}

// Connection Status
export enum ConnectionStatus {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  ERROR = 'ERROR'
}

// Firmware Types
export interface FirmwareImage {
  name: string;
  version: string;
  size: number;
  checksum: string;
  targetPlatform: 'STM32H7' | 'STM32F4' | 'STM32G4';
  coreType: CoreType;
  releaseDate: Date;
  changelog: string;
  binary: Buffer;
}

export interface FirmwareMetadata {
  version: string;
  coreType: CoreType;
  hardwareTarget: string;
  releaseDate: Date;
  changelog: string;
  checksum: {
    sha256: string;
    md5?: string;
  };
  features: Record<string, boolean>;
  minFirmwareVersion?: string;
  deprecated: boolean;
  downloadUrl: string;
  fileSize: number;
}

// Flight Controller Config
export interface FlightControllerConfig {
  deviceId: string;
  boardType: string;
  firmwareVersion: string;
  hardwareVersion: string;
  serialNumber: string;
  coreType: CoreType;
  gyroScale: number;
  accelScale: number;
  compassCalibration: {
    offset: { x: number; y: number; z: number };
    scale: { x: number; y: number; z: number };
  };
  imuAlignmentYaw: number;
  motorSequence: number[];
  pidProfiles: PIDProfile[];
  features: FeatureFlags;
  uartPorts: UARTConfig[];
  spiDevices: SPIConfig[];
  i2cDevices: I2CConfig[];
  advancedSettings: Record<string, any>;
}

export interface PIDProfile {
  name: string;
  description: string;
  rollPID: PIDCoefficients;
  pitchPID: PIDCoefficients;
  yawPID: PIDCoefficients;
  levelPID: PIDCoefficients;
}

export interface PIDCoefficients {
  p: number;
  i: number;
  d: number;
  f?: number;
  iLimit?: number;
}

export interface FeatureFlags {
  motorOutput: boolean;
  servoOutput: boolean;
  softSerial: boolean;
  telemetry: boolean;
  osdEnabled: boolean;
  blackboxLogging: boolean;
  airMode: boolean;
  antiGravity: boolean;
  dynamicFilter: boolean;
}

export interface UARTConfig {
  port: number;
  baudRate: number;
  function: 'msp' | 'gps' | 'telemetry' | 'debug' | 'blackbox';
  enabled: boolean;
}

export interface SPIConfig {
  csPin: number;
  device: 'gyro' | 'accel' | 'barometer' | 'flashchip' | 'osd';
  enabled: boolean;
}

export interface I2CConfig {
  busNumber: number;
  device: 'compass' | 'barometer' | 'rangefinder';
  enabled: boolean;
  address?: number;
}

// Telemetry
export interface TelemetryData {
  timestamp: number;
  source: TransportType;
  attitude: { roll: number; pitch: number; yaw: number };
  velocity: { x: number; y: number; z: number };
  position: { lat: number; lon: number; alt: number };
  imu: { accelX: number; accelY: number; accelZ: number };
  gyro: { x: number; y: number; z: number };
  magnetometer: { x: number; y: number; z: number };
  barometer?: { altitude: number; pressure: number };
  gps?: { satellites: number; hdop: number; vdop: number };
  batteryVoltage: number;
  batteryCurrent: number;
  systemLoad: number;
  errorCount: number;
  edgeAI?: {
    objectsDetected: number;
    thermalTarget?: { x: number; y: number; confidence: number };
    cpuUsage: number;
  };
}

// Upload Progress
export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  percentage: number;
  currentChunk: number;
  totalChunks: number;
  elapsedTime: number;
  estimatedTimeRemaining: number;
}

// Connection Info
export interface ConnectionInfo {
  transportType: TransportType;
  address: string;
  port?: number;
  baudRate?: number;
  status: ConnectionStatus;
  lastUpdate: number;
}

// Core Capabilities
export interface CoreCapabilities {
  EvoCore: {
    mavlink: boolean;
    telemetry: boolean;
    logging: boolean;
    edgeAI: boolean;
    advancedPID: boolean;
    multirotorSupport: boolean;
    fixedWingSupport: boolean;
    vtolSupport: boolean;
  };
  TensoCore: {
    mavlink: boolean;
    telemetry: boolean;
    logging: boolean;
    edgeAI: boolean;
    advancedPID: boolean;
    multirotorSupport: boolean;
    fixedWingSupport: boolean;
    vtolSupport: boolean;
  };
  NeuroCore: {
    mavlink: boolean;
    telemetry: boolean;
    logging: boolean;
    edgeAI: boolean;
    advancedPID: boolean;
    multirotorSupport: boolean;
    fixedWingSupport: boolean;
    vtolSupport: boolean;
  };
}

export const CORE_CAPABILITIES: CoreCapabilities = {
  EvoCore: {
    mavlink: true,
    telemetry: true,
    logging: false,
    edgeAI: false,
    advancedPID: false,
    multirotorSupport: true,
    fixedWingSupport: false,
    vtolSupport: false
  },
  TensoCore: {
    mavlink: true,
    telemetry: true,
    logging: true,
    edgeAI: false,
    advancedPID: true,
    multirotorSupport: true,
    fixedWingSupport: true,
    vtolSupport: false
  },
  NeuroCore: {
    mavlink: true,
    telemetry: true,
    logging: true,
    edgeAI: true,
    advancedPID: true,
    multirotorSupport: true,
    fixedWingSupport: true,
    vtolSupport: true
  }
};