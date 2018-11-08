const cypress = require("cypress");
const crypto = require("crypto");
const _ = require("lodash");

/*
* Add your config args in DEFAULT_CONFIG
* Set number of retries in MAX_NUM_RUNS
*/

// This script was taken from issue 1313 in Cypress
// https://github.com/cypress-io/cypress/issues/1313

const MAX_NUM_RUNS = 3;

const DEFAULT_CONFIG = {
  // you can omit 'spec' if you just want all your tests to run
  // spec: './cypress/integration/retries/**/*',
  browser: "electron",
  record: true,

  // parallelization options
  group: "main",
  parallel: true,

  // only necessary if recording specs from a local machine
  // ciBuildId: crypto.randomBytes(6).toString('hex')
};

// id unique to the machine
const uniqueId = crypto.randomBytes(3).toString("hex");

let totalFailuresIncludingRetries = 0;

const run = (num, spec, retryGroup) => {
  num += 1;
  const config = Object.assign(_.cloneDeep(DEFAULT_CONFIG), {
    env: {
      numRuns: num,
    },
  });

  if (spec) config.spec = spec;
  if (retryGroup) config.group = retryGroup;

  return cypress.run(config).then(results => {
    if (results.totalFailed) {
      totalFailuresIncludingRetries += results.totalFailed;

      // rerun again with only the failed tests
      const specs = _(results.runs)
        .filter("stats.failures")
        .map("spec.relative")
        .value();

      console.log(`Run #${num} failed.`);

      // if this is the 3rd total run (2nd retry)
      // and we've still got failures then just exit
      if (num >= MAX_NUM_RUNS) {
        console.log(`Ran a total of '${MAX_NUM_RUNS}' times but still have failures. Exiting...`);
        return process.exit(totalFailuresIncludingRetries);
      }

      console.log(`Retrying '${specs.length}' specs...`);
      console.log(specs);

      // If we're using parallelization, set a new group name
      let retryGroupName;
      if (DEFAULT_CONFIG.group) {
        retryGroupName = `${DEFAULT_CONFIG.group}: retry #${num}  (${specs.length} spec${
          specs.length === 1 ? "" : "s"
        } on ${uniqueId})`;
      }

      // kick off a new suite run
      return run(num, specs, retryGroupName);
    }
  });
};

// kick off the run with the default specs
run(0);
