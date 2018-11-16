import { contains, danger, fail, message } from "danger";

const currentCommitSHA = danger.git.commits[danger.git.commits.length - 1].sha;

function checkPackageLock() {
  const hasPackageLock =
    danger.git.created_files.filter(p => p.includes("package-lock.json")).length > 0;

  if (hasPackageLock) {
    fail("Detected package-lock.json, failing build. Do not use npm, use yarn instead.");
  }
}

function checkSmartContractGitModules() {
  const updatesContracts = (danger.github.pr.body + danger.github.pr.title).includes(
    "#with-contracts",
  );

  const hasContractSubmodule = danger.git.modified_files.some(p =>
    p.includes("platform-contracts-artifacts/"),
  );

  if (hasContractSubmodule && !updatesContracts) {
    fail(
      "Detected platform-contracts-artifacts in your PR, most likely this is by mistake please push alone",
    );
  }
}

function reportVisualRegression() {
  try {
    const reportLink = `https://s3.eu-central-1.amazonaws.com/neufund.visual.regression/${currentCommitSHA}/report/index.html`;

    const reportData = require("./.reg/out.json");

    message(`[Visual regression report](${reportLink})
    Changed files: **${reportData.failedItems.length}**
    New files: **${reportData.newItems.length}**
    Deleted files: **${reportData.deletedItems.length}**
    `);
  } catch (e) {
    console.error("Error: ", e);
    fail("Could not access visual regression report");
  }
}

checkPackageLock();
checkSmartContractGitModules();
reportVisualRegression();
