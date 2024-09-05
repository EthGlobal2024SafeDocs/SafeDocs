// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {ContentEscrow} from "../src/ContentEscrow.sol";

contract EscrowScript is Script {
    ContentEscrow public counter;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        counter = new ContentEscrow();

        vm.stopBroadcast();
    }
}
