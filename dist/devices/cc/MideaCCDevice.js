/***********************************************************************
 * Midea MDV Wi-Fi Controller Device class
 *
 * Copyright (c) 2025 Kovalovszky Patrik, https://github.com/kovapatrik
 *
 * With thanks to https://github.com/georgezhao2010/midea_ac_lan
 *
 */
import MideaDevice from '../../core/MideaDevice.js';
import { FanSpeed, HeatStatus, MessageCCResponse, MessageQueryTLV, MessageSetTLV, Mode } from './MideaCCMessage.js';
export default class MideaCCDevice extends MideaDevice {
    attributes;
    constructor(logger, device_info, config, deviceConfig) {
        super(logger, device_info, config, deviceConfig);
        this.attributes = {
            POWER: false,
            MODE: Mode.Auto,
            TARGET_TEMPERATURE: 26,
            FAN_SPEED: FanSpeed.Auto,
            SLEEP: false,
            ECO: false,
            DISPLAY: false,
            AUX_HEATING: false,
            PTC_SETTING: 0,
            PTC_POWER: false,
            SWING_UD: false,
            SWING_LR: false,
            SWING_UD_SITE: 0,
            SWING_LR_SITE: 0,
            INDOOR_TEMPERATURE: undefined,
            OUTDOOR_TEMPERATURE: undefined,
            ERROR_CODE: undefined,
            TEMPERATURE_PRECISION: 1,
            TEMP_FAHRENHEIT: false,
        };
    }
    build_query() {
        return [new MessageQueryTLV(this.device_protocol_version)];
    }
    process_message(msg) {
        const message = new MessageCCResponse(msg);
        if (this.verbose) {
            this.logger.debug(`[${this.name}] Body:\n${JSON.stringify(message.body)}`);
        }
        const changed = {};
        for (const status of Object.keys(this.attributes)) {
            const value = message.get_body_attribute(status.toLowerCase());
            if (value !== undefined) {
                if (this.attributes[status] !== value) {
                    // Track only those attributes that change value.  So when we send to the Homebridge /
                    // HomeKit accessory we only update values that change.  First time through this
                    // should be most/all attributes having initialized them to invalid values.
                    this.logger.debug(`[${this.name}] Value for ${status} changed from '${this.attributes[status]}' to '${value}'`);
                    changed[status] = value;
                }
                this.attributes[status] = value;
            }
        }
        const aux_heating = this.attributes.PTC_SETTING === HeatStatus.On || this.attributes.PTC_POWER;
        if (aux_heating !== this.attributes.AUX_HEATING) {
            this.attributes.AUX_HEATING = aux_heating;
            changed.AUX_HEATING = aux_heating;
        }
        // Now we update Homebridge / Homekit accessory
        if (Object.keys(changed).length > 0) {
            this.update(changed);
        }
        else {
            this.logger.debug(`[${this.name}] Status unchanged`);
        }
    }
    set_subtype() {
        this.logger.debug('No subtype for CC device');
    }
    // make_message_set(): MessageSet {
    //   const message = new MessageSet(this.device_protocol_version);
    //   message.power = this.attributes.POWER;
    //   message.mode = this.attributes.MODE;
    //   message.target_temperature = this.attributes.TARGET_TEMPERATURE;
    //   message.fan_speed = this.attributes.FAN_SPEED;
    //   message.eco = this.attributes.ECO;
    //   message.sleep = this.attributes.SLEEP;
    //   message.display = this.attributes.DISPLAY;
    //   message.exhaust = this.attributes.EXHAUST;
    //   message.ptc_setting = this.attributes.PTC_SETTING;
    //   message.swing_ud = this.attributes.SWING_UD;
    //   message.swing_lr = this.attributes.SWING_LR;
    //   message.swing_lr_site = this.attributes.SWING_LR_SITE;
    //   message.swing_ud_site = this.attributes.SWING_UD_SITE;
    //   return message;
    // }
    make_message_set_tlv() {
        const message = new MessageSetTLV(this.device_protocol_version);
        message.power = this.attributes.POWER;
        message.mode = this.attributes.MODE;
        message.target_temperature = this.attributes.TARGET_TEMPERATURE;
        message.fan_speed = this.attributes.FAN_SPEED;
        message.eco = this.attributes.ECO;
        message.sleep = this.attributes.SLEEP;
        message.display = this.attributes.DISPLAY;
        message.ptc_setting = this.attributes.PTC_SETTING;
        message.swing_ud = this.attributes.SWING_UD;
        message.swing_lr = this.attributes.SWING_LR;
        message.swing_lr_site = this.attributes.SWING_LR_SITE;
        message.swing_ud_site = this.attributes.SWING_UD_SITE;
        return message;
    }
    async set_attribute(attributes) {
        const messageToSend = {
            // SET: undefined,
            TLV_SET: undefined,
        };
        try {
            for (const [k, v] of Object.entries(attributes)) {
                if (v === this.attributes[k]) {
                    this.logger.info(`[${this.name}] Attribute ${k} already set to ${v}`);
                    continue;
                }
                this.logger.info(`[${this.name}] Set device attribute ${k} to: ${v}`);
                this.attributes[k] = v;
                messageToSend.TLV_SET ??= this.make_message_set_tlv();
                messageToSend.TLV_SET[k.toLowerCase()] = v;
            }
            for (const [k, v] of Object.entries(messageToSend)) {
                if (v !== undefined) {
                    this.logger.debug(`[${this.name}] Set message ${k}:\n${JSON.stringify(v)}`);
                    await this.build_send(v);
                }
            }
        }
        catch (err) {
            const msg = err instanceof Error ? err.stack : err;
            this.logger.debug(`[${this.name}] Error in set_attribute (${this.ip}:${this.port}):\n${msg}`);
        }
    }
    async set_target_temperature(target_temperature, mode) {
        this.logger.info(`[${this.name}] Set target temperature to: ${target_temperature}`);
        const message = this.make_message_set_tlv();
        message.target_temperature = target_temperature;
        this.attributes.TARGET_TEMPERATURE = target_temperature;
        if (mode) {
            message.mode = mode;
            message.power = true;
            this.attributes.MODE = mode;
            this.attributes.POWER = true;
        }
        await this.build_send(message);
    }
}
//# sourceMappingURL=MideaCCDevice.js.map