// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ISP} from "@ethsign/sign-protocol-evm/src/interfaces/ISP.sol";
import {Attestation} from "@ethsign/sign-protocol-evm/src/models/Attestation.sol";
import {DataLocation} from "@ethsign/sign-protocol-evm/src/models/DataLocation.sol";
import {ISPHook} from "@ethsign/sign-protocol-evm/src/interfaces/ISPHook.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ContentEscrow is ISPHook {
    ISP public spInstance;
    uint64 public schemaId;
    address moderator;

    struct Escrow {
        address contentCreator; // Content creator's address
        address subscriber; // EVM address associated with the escrow
        uint256 amount; // Amount of ETH in escrow
        uint64 validUntil; // Validity timestamp for the transformation key
        bool isReleased; // Status if funds are released
        uint256 documentId; // Document ID the subscriber wants access to (uint256)
        uint64 attestationId; // Attestation ID linked to the escrow
    }

    struct EscrowData {
        uint256 escrowId;
        uint256 documentId;
        bytes transformationKey;
    }

    mapping(uint256 => Escrow) public escrows; // Mapping of escrow ID to escrow details
    uint256 public nextEscrowId; // Incremental ID for each escrow

    event EscrowDeposited(
        uint256 indexed escrowId,
        address indexed contentCreator,
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

    event Test(bytes data);
    event LogSender(address indexed sender);

    constructor(address _spInstance) {
        moderator = msg.sender;
        spInstance = ISP(_spInstance); // Set the instance of the external SP contract
    }

    // Set schema id
    function setSchemaId(uint64 _schemaId) external {
        require(msg.sender == moderator, "Unauthorized");
        schemaId = _schemaId;
    }

    // Subscriber deposits funds into escrow, linked to their EVM address and document ID
    function depositEscrow(
        address contentCreator,
        uint256 documentId,
        uint64 validUntil
    ) external payable {
        require(msg.value > 0, "Must deposit some funds");

        escrows[nextEscrowId] = Escrow({
            contentCreator: contentCreator,
            subscriber: msg.sender,
            amount: msg.value,
            validUntil: validUntil,
            isReleased: false,
            documentId: documentId,
            attestationId: 0 // Placeholder for when the attestation is created
        });

        emit EscrowDeposited(
            nextEscrowId,
            contentCreator,
            msg.sender,
            msg.value,
            documentId
        );
        nextEscrowId++;
    }

    // Content creator releases funds by providing a transformation key and escrow ID, creates the attestation
    function releaseEscrow(
        uint256 escrowId,
        bytes memory transformationKey
    ) external {
        Escrow storage escrow = escrows[escrowId];
        address sender = msg.sender;
        emit LogSender(sender);
        require(
            sender == escrow.contentCreator,
            "Only content creator can release funds"
        );

        require(!escrow.isReleased, "Funds already released");
        require(escrow.amount > 0, "No funds available for this escrow");

        // Create the attestation with EscrowData struct containing escrow ID and transformation key
        EscrowData memory escrowData = EscrowData({
            escrowId: escrowId,
            documentId: escrow.documentId,
            transformationKey: transformationKey
        });

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
            data: abi.encode(escrowData) // Store the EscrowData struct as the data
        });

        spInstance.attest(a, "", "", "");
    }

    // Handle attestation with ETH payment
    function didReceiveAttestation(
        address attester,
        uint64, // schemaId
        uint64 attestationId,
        bytes calldata extraData
    ) external payable override {
        emit Test(extraData);
        // Decode the escrow ID from the extraData
        EscrowData memory escrowData = abi.decode(extraData, (EscrowData));
        uint256 escrowId = escrowData.escrowId;
        Escrow storage escrow = escrows[escrowId];
        require(!escrow.isReleased, "Funds already released");
        require(escrow.amount > 0, "No funds available for this escrow");

        // Transfer funds to the content creator
        // (bool success, ) = payable(attester).call{value: escrow.amount}("");
        // require(success, "Transfer failed");

        // Mark escrow as released
        escrow.isReleased = true;
        escrow.attestationId = attestationId;

        // Emit event
        emit EscrowReleased(
            escrowId,
            escrow.subscriber,
            attestationId,
            block.timestamp,
            escrow.validUntil
        );
    }

    // Handle attestation with ERC20 payment
    function didReceiveAttestation(
        address attester,
        uint64, // schemaId
        uint64 attestationId,
        IERC20 resolverFeeERC20Token,
        uint256 resolverFeeERC20Amount,
        bytes calldata extraData
    ) external override {
        emit Test(extraData);
        // Decode the escrow ID from the extraData
        EscrowData memory escrowData = abi.decode(extraData, (EscrowData));
        uint256 escrowId = escrowData.escrowId;
        Escrow storage escrow = escrows[escrowId];
        require(!escrow.isReleased, "Funds already released");
        require(escrow.amount > 0, "No funds available for this escrow");
        // Transfer the ERC20 token payment to the content creator
        require(
            resolverFeeERC20Token.transfer(attester, resolverFeeERC20Amount),
            "ERC20 transfer failed"
        );

        // // Transfer funds to the content creator
        // (bool success, ) = payable(attester).call{value: escrow.amount}("");
        // require(success, "Transfer failed");

        // Mark escrow as released
        escrow.isReleased = true;
        escrow.attestationId = attestationId;
        // Emit event
        emit EscrowReleased(
            escrowId,
            escrow.subscriber,
            attestationId,
            block.timestamp,
            escrow.validUntil
        );
    }

    // Handle revocation with ETH payment
    function didReceiveRevocation(
        address attester,
        uint64, // schemaId
        uint64 attestationId,
        bytes calldata extraData
    ) external payable override {
        // No support for revoke yet
    }

    // Handle revocation with ERC20 payment
    function didReceiveRevocation(
        address attester,
        uint64, // schemaId
        uint64 attestationId,
        IERC20 resolverFeeERC20Token,
        uint256 resolverFeeERC20Amount,
        bytes calldata extraData
    ) external override {
        // No support for revoke yet
    }

    // Get escrow details (public getter)
    function getEscrow(
        uint256 escrowId
    )
        external
        view
        returns (
            address contentCreator,
            address subscriber,
            uint256 amount,
            bool isReleased,
            uint256 documentId,
            uint64 attestationId
        )
    {
        Escrow storage escrow = escrows[escrowId];
        return (
            escrow.contentCreator,
            escrow.subscriber,
            escrow.amount,
            escrow.isReleased,
            escrow.documentId,
            escrow.attestationId
        );
    }
}
