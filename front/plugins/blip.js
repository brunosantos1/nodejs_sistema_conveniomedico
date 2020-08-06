"use strict"
import Vue from 'vue';
import { BlipChat } from 'blip-chat-widget'

export default {
  install(Vue, options) {
    const { appKey, button, account} = options;

    const blipClient = new BlipChat().withAppKey(appKey)
    .withButton(button);

    if (account) {
      blipClient.withAccount(account);
    }

    blipClient.build();

    Vue.prototype.$blip = blipClient;
    window.blip = blipClient;
  }
};