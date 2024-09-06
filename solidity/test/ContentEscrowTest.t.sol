// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/ContentEscrow.sol"; // Import the contract

contract ContentEscrowTest is Test {
    ContentEscrow escrow;
    address contentCreator = address(1); // Mock content creator
    address subscriber = address(2); // Mock subscriber

    function setUp() public {
        vm.prank(contentCreator); // Simulate contract creation by the content creator
        escrow = new ContentEscrow(
            contentCreator, // Mock content creator
            address(3), // Mock SP instance
            12345 // Mock schema ID
        );
    }

    // Test require condition for depositEscrow: "Must deposit some funds"
    function testDepositRequiresFunds() public {
        vm.prank(subscriber);
        vm.expectRevert("Must deposit some funds");
        escrow.depositEscrow(12345, 1693939513); // No funds provided
    }

    // Test require condition for releaseEscrow: "Only content creator can release funds"
    function testReleaseRequiresContentCreator() public {
        // Simulate a valid deposit from the subscriber
        vm.deal(subscriber, 1 ether);
        vm.prank(subscriber);
        escrow.depositEscrow{value: 1 ether}(12345, 1693939513);

        // Attempt to release escrow as the subscriber (not the content creator)
        vm.prank(subscriber);
        vm.expectRevert("Only content creator can release funds");
        escrow.releaseEscrow(0, new bytes(97)); // Empty 97-byte transformation key
    }

    // Test require condition for releaseEscrow: "Funds already released"
    function testReleaseFailsIfAlreadyReleased() public {
        // Simulate a valid deposit from the subscriber
        vm.deal(subscriber, 1 ether);
        vm.prank(subscriber);
        escrow.depositEscrow{value: 1 ether}(12345, 1693939513);

        // Release escrow for the first time as content creator
        vm.prank(contentCreator);
        escrow.releaseEscrow(0, new bytes(97)); // Provide a valid 97-byte transformation key

        // Attempt to release the same escrow again
        vm.prank(contentCreator);
        vm.expectRevert("Funds already released");
        escrow.releaseEscrow(0, new bytes(97)); // Provide the transformation key again
    }

    // Test require condition for releaseEscrow: "No funds available for this escrow"
    function testReleaseFailsIfNoFundsInEscrow() public {
        // Simulate an empty escrow with ID 0
        vm.prank(contentCreator);
        vm.expectRevert("No funds available for this escrow");
        escrow.releaseEscrow(0, new bytes(97));
    }

    // Test successful deposit
    function testSuccessfulDeposit() public {
        vm.deal(subscriber, 1 ether); // Give the subscriber 1 ETH
        vm.prank(subscriber); // Simulate the subscriber making the deposit

        // Perform the deposit with 1 ETH and document ID 12345
        escrow.depositEscrow{value: 1 ether}(12345, 1693939513);

        // Check contract balance is now 1 ETH
        assertEq(address(escrow).balance, 1 ether);

        // Retrieve the escrow details
        (
            address subscriberAddr,
            uint256 amount,
            bool isReleased,
            uint256 documentId,
            uint256 attestationId
        ) = escrow.getEscrow(0);

        // Assert that the values are correct
        assertEq(subscriberAddr, subscriber);
        assertEq(amount, 1 ether);
        assertFalse(isReleased);
        assertEq(documentId, 12345);
    }

    function testSuccessfulRelease() public {
        // Set up the test by depositing funds into escrow
        vm.deal(subscriber, 1 ether);
        vm.prank(subscriber);
        escrow.depositEscrow{value: 1 ether}(
            12345,
            uint64(block.timestamp + 30 days)
        );

        // Check initial balance of the content creator
        uint256 initialCreatorBalance = contentCreator.balance;

        // Prepare a valid 97-byte transformation key
        bytes memory transformationKey = new bytes(97);

        // Call the releaseEscrow function as the content creator
        vm.prank(contentCreator);
        escrow.releaseEscrow(0, transformationKey);

        // Check if the funds were transferred to the content creator
        assertEq(contentCreator.balance, initialCreatorBalance + 1 ether);

        // Retrieve the escrow details to verify release
        (
            ,
            uint256 amount,
            bool isReleased,
            uint256 documentId,
            uint64 attestationId
        ) = escrow.getEscrow(0);

        // Assert escrow was correctly released
        assertTrue(isReleased);
        assertEq(amount, 1 ether);
        assertEq(documentId, 12345);
        assertTrue(attestationId > 0); // Check that an attestation ID was created
    }

    // Test deposit event
    function testDepositEvent() public {
        vm.deal(subscriber, 1 ether);
        vm.prank(subscriber);

        // Expect the EscrowDeposited event to be emitted
        vm.expectEmit(true, true, true, true); // Check all event parameters
        emit ContentEscrow.EscrowDeposited(0, subscriber, 1 ether, 12345);

        // Perform the deposit, which should trigger the EscrowDeposited event
        escrow.depositEscrow{value: 1 ether}(12345, 1693939513);
    }

    // Test release event
    function testReleaseEvent() public {
        // Simulate a deposit from the subscriber
        vm.deal(subscriber, 1 ether);
        vm.prank(subscriber);
        escrow.depositEscrow{value: 1 ether}(12345, 1693939513);

        // Prepare a valid 97-byte transformation key
        bytes memory transformationKey = new bytes(97);

        // Expect the EscrowReleased event to be emitted with correct parameters
        uint256 currentTime = block.timestamp;
        uint256 validityUntil = currentTime + 30 days;
        vm.expectEmit(true, true, true, true);
        emit ContentEscrow.EscrowReleased(
            0,
            subscriber,
            0,
            currentTime,
            validityUntil
        );

        // Release the escrow, which should trigger the EscrowReleased event
        vm.prank(contentCreator);
        escrow.releaseEscrow(0, transformationKey);
    }
}
