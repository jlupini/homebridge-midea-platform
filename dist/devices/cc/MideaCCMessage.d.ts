/***********************************************************************
 * Midea MDV Wi-Fi Controller Device message handler class
 *
 * Copyright (c) 2025 Kovalovszky Patrik, https://github.com/kovapatrik
 *
 * With thanks to https://github.com/georgezhao2010/midea_ac_lan
 *                https://github.com/mill1000/midea-msmart
 *
 */
import { MessageBody, MessageRequest, MessageResponse, MessageType } from '../../core/MideaMessage.js';
export declare enum HeatStatus {
    Auto = 0,
    On = 16,
    Off = 32
}
export declare enum Mode {
    Fan = 1,
    Dry = 2,
    Heat = 4,
    Cool = 8,
    Auto = 16
}
export declare enum FanSpeed {
    Auto = 128,
    Power = 64,
    SuperHigh = 32,
    High = 16,
    Mid = 8,
    Low = 4,
    Micron = 2,
    Sleep = 1
}
declare abstract class MessageCCBase extends MessageRequest {
    constructor(device_protocol_version: number, message_type: MessageType, body_type: number);
    get body(): Buffer;
}
export declare class MessageQuery extends MessageCCBase {
    constructor(device_protocol_version: number);
    get _body(): Buffer;
}
export declare class MessageSet extends MessageCCBase {
    [key: string]: any;
    power: boolean;
    mode: Mode;
    fan_speed: FanSpeed;
    target_temperature: number;
    eco: boolean;
    sleep: boolean;
    display: boolean;
    exhaust: boolean;
    ptc_setting: HeatStatus;
    swing_ud: boolean;
    swing_lr: boolean;
    swing_lr_site: number;
    swing_ud_site: number;
    constructor(device_protocol_version: number);
    get _body(): Buffer;
}
export declare class CCGeneralMessageBody extends MessageBody {
    power: boolean;
    mode: Mode;
    fan_speed: FanSpeed;
    target_temperature: number;
    indoor_temperature: number;
    evaporator_entrance_temperature: number;
    evaporator_exit_temperature: number;
    eco: boolean;
    sleep: boolean;
    display: boolean;
    exhaust: boolean;
    ptc_setting: HeatStatus;
    ptc_power: boolean;
    control_fan_speed: number;
    temperature_precision: 1 | 0.5;
    swing_ud: boolean;
    swing_lr: boolean;
    swing_ud_site: number;
    swing_lr_site: number;
    error_code: number;
    temp_fahrenheit: boolean;
    constructor(body: Buffer);
}
export declare class CCTLVMessageBody extends MessageBody {
    power: boolean;
    mode: Mode;
    fan_speed: FanSpeed;
    target_temperature: number;
    indoor_temperature?: number;
    outdoor_temperature?: number;
    eco: boolean;
    sleep: boolean;
    display: boolean;
    ptc_setting: HeatStatus;
    ptc_power: boolean;
    temperature_precision: 1 | 0.5;
    swing_ud: boolean;
    swing_lr: boolean;
    swing_ud_site: number;
    swing_lr_site: number;
    error_code: number;
    temp_fahrenheit: boolean;
    constructor(body: Buffer, isControlResponse: boolean);
}
export declare class MessageQueryTLV extends MessageRequest {
    constructor(device_protocol_version: number);
    get _body(): Buffer;
}
export declare class MessageSetTLV extends MessageRequest {
    [key: string]: any;
    power: boolean;
    mode: Mode;
    fan_speed: FanSpeed;
    target_temperature: number;
    eco: boolean;
    sleep: boolean;
    display: boolean;
    ptc_setting: HeatStatus;
    swing_ud: boolean;
    swing_lr: boolean;
    swing_ud_site: number;
    swing_lr_site: number;
    constructor(device_protocol_version: number);
    get _body(): Buffer;
}
export declare class MessageCCResponse extends MessageResponse {
    constructor(message: Buffer);
}
export {};
