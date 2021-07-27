import type { MappingConfig } from "../../src/mapping_config.ts";

export default <MappingConfig[]> [
  {
    name: "home",

    guards: {
      hostname: "myhome",
      platform: "win32",
    },

    link: {
      "test": "test",
      "test2": "test1",
    },

    preScripts: [
      'echo "$DDOT_HOSTNAME $DDOT_PLATFORM pre works!"',
    ],

    postScripts: [
      "echo 'post works!'",
    ],
  },

  {
    name: "laptop",

    guards: {
      hostname: "mylaptop",
      platform: ["darwin", "win32"],
    },

    link: {
      "test": "test",
      "test2": "test1",
    },

    preScripts: [
      'echo "$DDOT_NAME $DDOT_PLATFORM pre works!"',
    ],

    postScripts: [
      "echo 'laptop post works!'",
    ],
  },

  {
    name: "server",

    guards: {
      hostname: "myserver",
      platform: "linux",
    },

    link: {
      "test": "test",
      "test2": "test1",
    },

    preScripts: [
      'echo "$DDOT_NAME $DDOT_PLATFORM pre works!"',
    ],

    postScripts: [
      "echo 'server post works!'",
    ],
  },
];
