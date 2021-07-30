import type { MappingConfig } from "../../src/mapping_config.ts";

export default <MappingConfig[]> [
  {
    name: "home",

    guards: {
      hostname: "home",
      platform: "windows",
    },

    link: {
      "test": "test",
      "test2": "test1",
    },

    scripts: [
      'echo "$DDOT_NAME $DDOT_PLATFORM"',
      "echo works!",
    ],
  },

  {
    name: "laptop",

    guards: {
      hostname: "laptop",
      platform: ["darwin", "windows"],
    },

    link: {
      "test": "test",
      "test2": "test1",
    },

    scripts: [
      'echo "$DDOT_NAME $DDOT_PLATFORM"',
      "echo works!",
    ],
  },

  {
    name: "server",

    guards: {
      hostname: "server",
      platform: "linux",
    },

    link: {
      "test": "test",
      "test2": "test1",
    },

    scripts: [
      'echo "$DDOT_NAME $DDOT_PLATFORM"',
      "echo works!",
    ],
  },

  {
    name: "desktop",
    extends: "server",

    scripts: ["echo desktop"],
  },
];
