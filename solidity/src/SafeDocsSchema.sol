// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ISP} from "@ethsign/sign-protocol-evm/src/interfaces/ISP.sol";
import {ISPHook} from "@ethsign/sign-protocol-evm/src/interfaces/ISPHook.sol";
import {DataLocation} from "@ethsign/sign-protocol-evm/src/models/DataLocation.sol";
import {Schema} from "@ethsign/sign-protocol-evm/src/models/Schema.sol";

contract SchemaCreator {
    ISP public signProtocolInstance; // The instance of the Sign Protocol
    address public schemaOwner; // Address that owns the schema
    uint64 public schemaId; // Schema ID created
    address public hookAddress; // Address of the hook registered to the schema

    event SchemaCreated(uint64 indexed schemaId, address indexed hookAddress);

    constructor(
        address _signProtocolInstance,
        address _hookAddress,
        string memory _schemaData
    ) {
        schemaOwner = msg.sender; // Set the owner to the address deploying the contract
        signProtocolInstance = ISP(_signProtocolInstance); // Initialize the Sign Protocol instance

        // Construct the schema struct
        Schema memory newSchema = Schema({
            registrant: msg.sender,
            revocable: false,
            dataLocation: DataLocation.ONCHAIN,
            maxValidFor: 0,
            hook: ISPHook(_hookAddress), // Register the hook to the schema
            timestamp: uint64(block.timestamp), // Use current block timestamp
            data: _schemaData // Metadata or any extra data for the schema
        });
    }

    // Function to create a new schema and register the hook
    function createSchemaWithHook(
        bool _revocable,
        DataLocation _dataLocation,
        uint64 _maxValidFor,
        address _hookAddress,
        string memory _schemaData
    ) external {
        require(
            msg.sender == schemaOwner,
            "Only the schema owner can create schemas"
        );

        // Construct the schema struct
        Schema memory newSchema = Schema({
            registrant: msg.sender,
            revocable: _revocable,
            dataLocation: _dataLocation,
            maxValidFor: _maxValidFor,
            hook: ISPHook(_hookAddress), // Register the hook to the schema
            timestamp: uint64(block.timestamp), // Use current block timestamp
            data: _schemaData // Metadata or any extra data for the schema
        });

        // Create the schema on Sign Protocol and get the schemaId
        schemaId = signProtocolInstance.createSchema(newSchema);

        // Store the hook address
        hookAddress = _hookAddress;

        // Emit event for the schema creation
        emit SchemaCreated(schemaId, _hookAddress);
    }

    // Optional: Function to update the hook for the schema
    function updateHook(uint64 _schemaId, address newHookAddress) external {
        require(
            msg.sender == schemaOwner,
            "Only the schema owner can update the hook"
        );

        // Update the hook on the Sign Protocol instance
        signProtocolInstance.registerHook(_schemaId, newHookAddress);

        // Update the stored hook address
        hookAddress = newHookAddress;
    }
}
