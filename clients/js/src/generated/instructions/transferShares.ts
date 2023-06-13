/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  AccountMeta,
  Context,
  Pda,
  PublicKey,
  Serializer,
  Signer,
  TransactionBuilder,
  mapSerializer,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import { addAccountMeta, addObjectProperty } from '../shared';

// Accounts.
export type TransferSharesInstructionAccounts = {
  authority?: Signer;
  fromMember: PublicKey | Pda;
  toMember: PublicKey | Pda;
  fanout: PublicKey | Pda;
  fromMembershipAccount: PublicKey | Pda;
  toMembershipAccount: PublicKey | Pda;
};

// Data.
export type TransferSharesInstructionData = {
  discriminator: Array<number>;
  shares: bigint;
};

export type TransferSharesInstructionDataArgs = { shares: number | bigint };

export function getTransferSharesInstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<
  TransferSharesInstructionDataArgs,
  TransferSharesInstructionData
> {
  const s = context.serializer;
  return mapSerializer<
    TransferSharesInstructionDataArgs,
    any,
    TransferSharesInstructionData
  >(
    s.struct<TransferSharesInstructionData>(
      [
        ['discriminator', s.array(s.u8(), { size: 8 })],
        ['shares', s.u64()],
      ],
      { description: 'TransferSharesInstructionData' }
    ),
    (value) => ({
      ...value,
      discriminator: [195, 175, 36, 50, 101, 22, 28, 87],
    })
  ) as Serializer<
    TransferSharesInstructionDataArgs,
    TransferSharesInstructionData
  >;
}

// Args.
export type TransferSharesInstructionArgs = TransferSharesInstructionDataArgs;

// Instruction.
export function transferShares(
  context: Pick<Context, 'serializer' | 'programs' | 'identity'>,
  input: TransferSharesInstructionAccounts & TransferSharesInstructionArgs
): TransactionBuilder {
  const signers: Signer[] = [];
  const keys: AccountMeta[] = [];

  // Program ID.
  const programId = context.programs.getPublicKey(
    'mplHydra',
    'hyDQ4Nz1eYyegS6JfenyKwKzYxRsCWCriYSAjtzP4Vg'
  );

  // Resolved inputs.
  const resolvedAccounts = {
    fromMember: [input.fromMember, false] as const,
    toMember: [input.toMember, false] as const,
    fanout: [input.fanout, true] as const,
    fromMembershipAccount: [input.fromMembershipAccount, true] as const,
    toMembershipAccount: [input.toMembershipAccount, true] as const,
  };
  const resolvingArgs = {};
  addObjectProperty(
    resolvedAccounts,
    'authority',
    input.authority
      ? ([input.authority, false] as const)
      : ([context.identity, false] as const)
  );
  const resolvedArgs = { ...input, ...resolvingArgs };

  addAccountMeta(keys, signers, resolvedAccounts.authority, false);
  addAccountMeta(keys, signers, resolvedAccounts.fromMember, false);
  addAccountMeta(keys, signers, resolvedAccounts.toMember, false);
  addAccountMeta(keys, signers, resolvedAccounts.fanout, false);
  addAccountMeta(keys, signers, resolvedAccounts.fromMembershipAccount, false);
  addAccountMeta(keys, signers, resolvedAccounts.toMembershipAccount, false);

  // Data.
  const data =
    getTransferSharesInstructionDataSerializer(context).serialize(resolvedArgs);

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
