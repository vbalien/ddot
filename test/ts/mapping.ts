import type { MappingConfig } from "../../src/mapping_config.ts";

export default <MappingConfig[]> [
  {
    name: "home",

    guard: {
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

    guard: {
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

    guard: {
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
    extend: "server",

    scripts: ["echo desktop"],
  },
];
