// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ContentEscrow {
    struct Escrow {
        address subscriber; // EVM address associated with the escrow
        uint256 amount; // Amount of ETH in escrow
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
        bytes transformationKey,
        uint256 timestamp,
        uint256 validityUntil
    );

    constructor() {
        contentCreator = msg.sender; // Content creator is the contract deployer
    }

    // Subscriber deposits funds into escrow, linked to their EVM address and document ID
    function depositEscrow(uint256 documentId) external payable {
        require(msg.value > 0, "Must deposit some funds");

        escrows[nextEscrowId] = Escrow({
            subscriber: msg.sender,
            amount: msg.value,
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

        // Transfer funds to content creator
        // payable(contentCreator).transfer(escrow.amount);
        (bool success, ) = payable(contentCreator).call{value: escrow.amount}(
            ""
        );
        require(success, "Transfer failed");

        // Mark escrow as released and store the transformation key
        escrow.isReleased = success;

        // Emit event
        uint256 validityUntil = block.timestamp + 30 days;
        emit EscrowReleased(
            escrowId,
            escrow.subscriber,
            transformationKey,
            block.timestamp,
            validityUntil
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
