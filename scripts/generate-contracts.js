const tc = require("typechain");
const path = require("path");
const fs = require("fs");
const loadAppEnv = require("../webpack/loadAppEnv");

loadAppEnv(process.env);

const artifactsVersion = process.env.NF_CONTRACT_ARTIFACTS_VERSION || "localhost";

const contractsPath = `git_modules/platform-contracts-artifacts/${artifactsVersion}`;
const outDir = "app/lib/contracts";

// @ts-ignore
global.IS_CLI = true;

async function generateKnownInterfaces() {
  const knownInterfaces = require(`../${contractsPath}/meta.json`).KNOWN_INTERFACES;
  fs.writeFileSync(
    path.resolve(__dirname, "..", outDir, "knownInterfaces.json"),
    JSON.stringify(knownInterfaces, null, "  "),
  );
}

tc.generateTypeChainWrappers({
  outDir,
  glob: `${contractsPath}/contracts/*.json`,
  force: true,
})
  .catch(e => {
    console.error("Failed to generate typechain contract wrappers");
    console.error(e.message);
    process.exit(1);
  })
  .then(() => generateKnownInterfaces())
  .catch(e => {
    console.error("Failed to read meta.json and generate knownInterfaces.json");
    console.error(e.message);
    process.exit(1);
  });
