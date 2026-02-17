export interface Logger {
  log: (...args: any[]) => void;
  error?: (...args: any[]) => void;
}

export interface WhatsAppPairingInfo {
  phoneNumber: string;
  code: string;
  socket: any;
}

export interface WhatsAppOptions {
  logger?: Logger;
  commandPrefix?: string;
  phoneNumber?: string;
  authFolder?: string;
  printQRInTerminal?: boolean;
  pairingLog?: (info: WhatsAppPairingInfo) => void;
}

export interface TelegramButtonConfig {
  id: string;
  text: string;
  url?: string;
  row?: number;
  replyText?: string;
}

export interface TelegramOptions {
  logger?: Logger;
  token?: string;
  menuButtons?: TelegramButtonConfig[];
   menuPreset?: "vps";
}

export interface DiscordOptions {
  logger?: Logger;
  token?: string;
  commandPrefix?: string;
}

export interface StartAllOptions {
  logger?: Logger;
  whatsapp?: WhatsAppOptions;
  telegram?: TelegramOptions;
  discord?: DiscordOptions;
}

export interface ShegrafConfig extends StartAllOptions {}

export interface ShegrafInstance {
  start(options?: StartAllOptions): Promise<void>;
  startWhatsApp(options?: WhatsAppOptions): Promise<any>;
  startTelegram(options?: TelegramOptions): any;
  startDiscord(options?: DiscordOptions): any;
}

export function startWhatsApp(options?: WhatsAppOptions): Promise<any>;

export function startTelegram(options?: TelegramOptions): any;

export function startDiscord(options?: DiscordOptions): any;

export function startAll(options?: StartAllOptions): Promise<void>;

export function createShegraf(config?: ShegrafConfig): ShegrafInstance;

