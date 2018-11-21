import { Q18 } from "./../../config/constants";
import { getNonceRpc, ETransactionStatus } from "./../utils/ethRpcUtils";
import { createAndLoginNewUser } from "../utils/userHelpers";
import { tid } from "../utils";
import web3Accounts from "web3-eth-accounts";
import { getChainIdRpc, sendRawTransactionRpc, getTransactionReceipt } from "../utils/ethRpcUtils";
import {
  charRegExPattern,
  letterRegExPattern,
  FIXTURE_ACCOUNTS,
  letterKeepDotRegExPattern,
} from "../utils/index";
import BigNumber from "bignumber.js";
import { formatThousands } from "../../utils/Number.utils";

const NODE_ADDRESS = "https://localhost:9090/node";

//this constant is hard coded!
const FIXTURE_DIV_CONSTANT = 100000000000000;

const ADDRESS = "0x429123b08DF32b0006fd1F3b0Ef893A8993802f3";
describe("Wallet Migration Flow", () => {
  it("It will migrate an ICBM wallet into a new user", () => {
    createAndLoginNewUser({
      type: "investor",
      kyc: "individual",
    }).then(() => {
      const privKeyHex = "0x79177f5833b64c8fdcc9862f5a779b8ff0e1853bf6e9e4748898d4b6de7e8c93";
      const account = new web3Accounts().privateKeyToAccount(privKeyHex);
      cy.visit("/settings");
      cy.get(tid("models.settings.icbm-wallet-widget.check-your-icbm-wallet-widget.address")).type(
        ADDRESS + "{enter}",
      );
      // Assert that the values of NEU and ETHER are correct
      cy.get(tid("settings.modal.icbm-wallet-balance.neu-balance")).then(data => {
        const neuBalance = new BigNumber(FIXTURE_ACCOUNTS[ADDRESS].icbmEtherLockBalance[1])
          .div(FIXTURE_DIV_CONSTANT)
          .round();

        const ethBalance = new BigNumber(FIXTURE_ACCOUNTS[ADDRESS].icbmEtherLockBalance[0])
          .div(Q18)
          .round(4);

        cy.get(tid("settings.modal.icbm-wallet-balance.eth-balance")).then(ethData => {
          const walletEthBalance = new BigNumber(
            ethData.text().replace(letterKeepDotRegExPattern, ""),
          );
          const walletNeuBalance = new BigNumber(data.text().replace(letterRegExPattern, ""));

          expect(walletNeuBalance.equals(neuBalance)).to.be.true;
          expect(walletEthBalance.equals(ethBalance)).to.be.true;

          cy.get(tid("modals.icbm-balance-modal.balance-footer.generate-transaction"))
            .wait(2000)
            .click();
          cy.get(tid("modals.icbm-balance-modal.migrate-body.to")).then(toField => {
            const to = toField
              .text()
              .replace(charRegExPattern, "")
              .split("Tosmartcontract")
              .pop();
            cy.get(tid("modals.icbm-balance-modal.migrate-body.gas-limit")).then(gasLimitField => {
              const gas = gasLimitField
                .text()
                .replace(charRegExPattern, "")
                .split("Gaslimit")
                .pop();

              cy.get(tid("modals.icbm-balance-modal.migrate-body.input-data")).then(
                inputDataField => {
                  const data = inputDataField
                    .text()
                    .replace(charRegExPattern, "")
                    .split("Data")
                    .pop();
                  getNonceRpc(NODE_ADDRESS, "0x429123b08DF32b0006fd1F3b0Ef893A8993802f3").then(
                    nonce => {
                      getChainIdRpc(NODE_ADDRESS).then(chainId => {
                        account
                          .signTransaction({
                            to,
                            value: "0",
                            gas,
                            data,
                            gasPrice: "1",
                            nonce: nonce.body.result,
                            chainId: chainId.body.result,
                          })
                          .then((signed: any) => {
                            console.log(signed);
                            cy.log("Sending First Transaction");
                            sendRawTransactionRpc(NODE_ADDRESS, signed.rawTransaction).then(
                              hash => {
                                // Wait for transaction to get conducted
                                cy.wait(1000);
                                getTransactionReceipt(NODE_ADDRESS, hash.body.result).then(
                                  receipt => {
                                    cy.log("Sending First Transaction");
                                    // Check if the conducted transaction was successful
                                    expect(receipt.body.result.status).to.equal(
                                      ETransactionStatus.SUCCESS,
                                    );
                                    // Wait until transaction is success then click
                                    cy.get(
                                      tid(
                                        "modals.icbm-balance-modal.balance-footer.successful-transaction",
                                      ),
                                    ).awaitedClick();
                                    // Modal Should Detect The transaction and Transition to Step 2
                                    cy.get(tid("modals.icbm-balance-modal.migrate-body.step-2"));

                                    cy.get(tid("modals.icbm-balance-modal.migrate-body.to")).then(
                                      toField => {
                                        const to = toField
                                          .text()
                                          .replace(charRegExPattern, "")
                                          .split("Tosmartcontract")
                                          .pop();
                                        cy.get(
                                          tid("modals.icbm-balance-modal.migrate-body.gas-limit"),
                                        ).then(gasLimitField => {
                                          const gas = gasLimitField
                                            .text()
                                            .replace(charRegExPattern, "")
                                            .split("Gaslimit")
                                            .pop();

                                          cy.get(
                                            tid(
                                              "modals.icbm-balance-modal.migrate-body.input-data",
                                            ),
                                          ).then(inputDataField => {
                                            const data = inputDataField
                                              .text()
                                              .replace(charRegExPattern, "")
                                              .split("Data")
                                              .pop();
                                            getNonceRpc(
                                              NODE_ADDRESS,
                                              "0x429123b08DF32b0006fd1F3b0Ef893A8993802f3",
                                            ).then(nonce => {
                                              getChainIdRpc(NODE_ADDRESS).then(chainId => {
                                                account
                                                  .signTransaction({
                                                    to,
                                                    value: "0",
                                                    gas,
                                                    data,
                                                    gasPrice: "1",
                                                    nonce: nonce.body.result,
                                                    chainId: chainId.body.result,
                                                  })
                                                  .then((signed: any) => {
                                                    sendRawTransactionRpc(
                                                      NODE_ADDRESS,
                                                      signed.rawTransaction,
                                                    ).then(hash => {
                                                      // Wait for transaction to get conducted
                                                      cy.wait(1000);
                                                      getTransactionReceipt(
                                                        NODE_ADDRESS,
                                                        hash.body.result,
                                                      ).then(receipt => {
                                                        // Check if the conducted transaction was successful
                                                        expect(receipt.body.result.status).to.equal(
                                                          ETransactionStatus.SUCCESS,
                                                        );
                                                        // Modal Should Detect The transaction and Transition to success flow
                                                        cy.get(
                                                          tid(
                                                            "modals.icbm-balance-modal.balance-footer.successful-transaction",
                                                          ),
                                                        );
                                                      });
                                                    });
                                                  });
                                              });
                                            });
                                          });
                                        });
                                      },
                                    );
                                  },
                                );
                              },
                            );
                          });
                      });
                    },
                  );
                },
              );
            });
          });
        });
      });
    });
  });
});
