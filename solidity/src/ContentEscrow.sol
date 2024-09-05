// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ISP} from "@ethsign/sign-protocol-evm/src/interfaces/ISP.sol";
import {Attestation} from "@ethsign/sign-protocol-evm/src/models/Attestation.sol";
import {DataLocation} from "@ethsign/sign-protocol-evm/src/models/DataLocation.sol";

contract ContentEscrow {
    ISP public spInstance;
    uint64 public schemaId;

    struct Escrow {
        address subscriber; // EVM address associated with the escrow
        uint256 amount; // Amount of ETH in escrow
        uint64 validUntil; // Validity timestamp for the transformation key
        bool isReleased; // Status if funds are released
        uint256 documentId; // Document ID the subscriber wants access to (uint256)
    }

    address public contentCreator; // Content creator's address
    mapping(uint256 => Escrow) public escrows; // Mapping of escrow ID to escrow details
    uint256 public nextEscrowId; // Incremental ID for each escrow

    event EscrowDeposited(
        uint256 indexed escrowId,
        address indexed subscriber,
        uint256 amount,
        uint256 documentId
    );

    event EscrowReleased(
        uint256 indexed escrowId,
        address indexed subscriber,
        uint256 attestationId,
        uint256 timestamp,
        uint256 validityUntil
    );

    constructor(
        address _contentCreator,
        address _spInstance,
        uint64 _schemaId
    ) {
        contentCreator = _contentCreator; // Set the content creator address
        spInstance = ISP(_spInstance); // Set the instance of the external SP contract
        schemaId = _schemaId; // Set the schema ID
    }

    // Subscriber deposits funds into escrow, linked to their EVM address and document ID
    function depositEscrow(
        uint256 documentId,
        uint64 validUntil
    ) external payable {
        require(msg.value > 0, "Must deposit some funds");

        escrows[nextEscrowId] = Escrow({
            subscriber: msg.sender,
            amount: msg.value,
            validUntil: validUntil,
            isReleased: false,
            documentId: documentId
        });

        emit EscrowDeposited(nextEscrowId, msg.sender, msg.value, documentId);
        nextEscrowId++;
    }

    // Content creator releases funds by providing a transformation key (97-byte string) and escrow ID
    function releaseEscrow(
        uint256 escrowId,
        bytes memory transformationKey
    ) external {
        require(
            msg.sender == contentCreator,
            "Only content creator can release funds"
        );
        Escrow storage escrow = escrows[escrowId];
        require(!escrow.isReleased, "Funds already released");
        require(escrow.amount > 0, "No funds available for this escrow");
        require(
            transformationKey.length == 97,
            "Transformation key must be 97 bytes long"
        );

        bytes[] memory recipients = new bytes[](1);
        recipients[0] = abi.encode(escrow.subscriber);
        Attestation memory a = Attestation({
            schemaId: schemaId,
            linkedAttestationId: 0,
            attestTimestamp: 0,
            revokeTimestamp: 0,
            attester: address(this),
            validUntil: escrow.validUntil,
            dataLocation: DataLocation.ONCHAIN,
            revoked: false,
            recipients: recipients,
            data: transformationKey // SignScan assumes this is from `abi.encode(...)`
        });

        uint64 attestationId = spInstance.attest(a, "", "", "");

        // Transfer funds to content creator
        // payable(contentCreator).transfer(escrow.amount);
        (bool success, ) = payable(contentCreator).call{value: escrow.amount}(
            ""
        );
        require(success, "Transfer failed");

        // Mark escrow as released and store the transformation key
        escrow.isReleased = success;

        // Emit event
        emit EscrowReleased(
            escrowId,
            escrow.subscriber,
            attestationId,
            block.timestamp,
            escrow.validUntil
        );
    }

    // Get escrow details (public getter)
    function getEscrow(
        uint256 escrowId
    )
        external
        view
        returns (
            address subscriber,
            uint256 amount,
            bool isReleased,
            uint256 documentId
        )
    {
        Escrow storage escrow = escrows[escrowId];
        return (
            escrow.subscriber,
            escrow.amount,
            escrow.isReleased,
            escrow.documentId
        );
    }
}
