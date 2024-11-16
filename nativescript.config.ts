import { NativeScriptConfig } from '@nativescript/core';

export default {
  id: 'com.sportclubmanagement.app',
  appPath: 'app',
  appResourcesPath: 'App_Resources',
  android: {
    v8Flags: '--expose_gc',
    markingMode: 'none'
  }
} as NativeScriptConfig;