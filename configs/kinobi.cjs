const path = require("path");
const k = require("@metaplex-foundation/kinobi");

// Paths.
const clientDir = path.join(__dirname, "..", "clients");
const idlDir = path.join(__dirname, "..", "idls");

// Instanciate Kinobi.
const kinobi = k.createFromIdls([path.join(idlDir, "hydra.json")]);

// Update programs.
kinobi.update(
  k.updateProgramsVisitor({
    hydra: { name: "mplHydra" },
  })
);
// Remove "process" prefix from instructions.
kinobi.update(
  k.bottomUpTransformerVisitor([
    {
      select: "[instructionNode]",
      transform: (node) => {
        k.assertIsNode(node, ["instructionNode"]);
        if (!node.name.startsWith("process")) return node;
        const newName = node.name.replace(/^process/, "");
        return k.instructionNode({
          ...node,
          name: newName,
        });
      },
    },
  ])
);

kinobi.update(
  k.updateAccountsVisitor({
    fanout: {
      size: 300,
      seeds: [
        k.constantPdaSeedNodeFromString("fanout-config"),
        k.variablePdaSeedNode(
          "name",
          k.stringTypeNode({ size: k.remainderSizeNode() }),
          "The name of the fanout account"
        ),
      ],
    },
    fanoutMembershipVoucher: {
      size: 153,
      seeds: [
        k.constantPdaSeedNodeFromString("fanout-membership"),
        k.variablePdaSeedNode(
          "fanout",
          k.publicKeyTypeNode(),
          "The address of the fanout account"
        ),
        k.variablePdaSeedNode(
          "membership",
          k.publicKeyTypeNode(),
          "The address of the membership account"
        ),
      ],
    },
    /*     fanoutNativeAccount: {
        size: 1,
        seeds: [
          k.constantPdaSeedNodeFromString("fanout-native-account"),
          k.variablePdaSeedNode(
            "fanout",
            k.publicKeyTypeNode(),
            "The address of the fanout account"
          ),
        ],
      }, */
    fanoutMembershipMintVoucher: {
      size: 105,
      seeds: [
        k.constantPdaSeedNodeFromString("fanout-membership"),
        k.variablePdaSeedNode(
          "fanout",
          k.publicKeyTypeNode(),
          "The address of the fanout account"
        ),
        k.variablePdaSeedNode(
          "membership",
          k.publicKeyTypeNode(),
          "The address of the membership account"
        ),
        k.variablePdaSeedNode(
          "mint",
          k.publicKeyTypeNode(),
          "The address of the mint account"
        ),
      ],
    },
  })
);

kinobi.update(
  k.updateInstructionsVisitor({
    init: {
      accounts: {
        fanout: {
          defaultValue: k.pdaValueNode("fanout"),
        },
         holdingAccount: {
          defaultValue: k.pdaValueNode(
            k.pdaLinkNode("fanoutNativeAccount", "hooked"),
            [k.pdaSeedValueNode("fanout", k.argumentValueNode("fanout"))]
          ),
        }, 
        membershipMint: {
          defaultValue: k.publicKeyValueNode(
            "So11111111111111111111111111111111111111112",
            "Wrapped Solana"
          ),
        },
      },
      arguments: {
        bumpSeed: {
          defaultValue: k.accountBumpValueNode("fanout"),
        },
        nativeAccountBumpSeed: {
          defaultValue: k.accountBumpValueNode("holdingAccount"),
        },
      },
    },
    addMemberWallet: {
        accounts: {
          membershipAccount: {
            defaultValue: k.pdaValueNode("fanoutMembershipVoucher"),
          },
          membership: {

          }
        },
      },
  })
);

/* kinobi.update(
    k.unwrapDefinedTypesVisitor(["addMemberArgs"])
) */

// Render JavaScript.
const jsDir = path.join(clientDir, "js", "src", "generated");
const prettier = require(path.join(clientDir, "js", ".prettierrc.json"));
kinobi.accept(
  k.renderJavaScriptVisitor(jsDir, {
    prettier,
    internalNodes: [],
  })
);
