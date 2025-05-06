module.exports = {
  branches: ["main", "master"],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",

    "@semantic-release/npm",
    [
      "@semantic-release/exec",
      {
        prepareCmd: "npm run build && npm run package"
      }
    ],
    [
      "@semantic-release/github",
      {
        assets: [
          "job-tracker-extension.zip",
          "job-tracker-extension.crx"
        ]
      }
    ],
    [
      "@semantic-release/git",
      {
        assets: [
          "package.json",
          "manifest.json",
          "CHANGELOG.md"
        ],
        message:
          "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
      }
    ]
  ],
  preset: "conventionalcommits"
};
