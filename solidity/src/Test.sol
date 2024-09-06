// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ISP} from "@ethsign/sign-protocol-evm/src/interfaces/ISP.sol";
import {Attestation} from "@ethsign/sign-protocol-evm/src/models/Attestation.sol";
import {DataLocation} from "@ethsign/sign-protocol-evm/src/models/DataLocation.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Test {
    constructor(address _spInstance, uint64 _schemaId, bytes memory data) {
        ISP spInstance = ISP(_spInstance);

        bytes[] memory recipients = new bytes[](1);
        recipients[0] = abi.encode(msg.sender);
        Attestation memory a = Attestation({
            schemaId: _schemaId,
            linkedAttestationId: 0,
            attestTimestamp: 0,
            revokeTimestamp: 0,
            attester: msg.sender,
            validUntil: 0,
            dataLocation: DataLocation.ONCHAIN,
            revoked: false,
            recipients: recipients,
            data: data
        });

        spInstance.attest(a, "", "", "");
    }
}
