//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
// import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * A smart contract that allows users to sign a guestbook and build a wall brick by brick
 * @author BuidlGuidl
 */
contract YourContract {
    // State Variables
    address public immutable owner;
    string public greeting = "Building Unstoppable Apps!!!";
    bool public premium = false;
    uint256 public totalCounter = 0;
    mapping(address => uint) public userGreetingCounter;
    
    // Guestbook functionality
    address[] public builders;
    mapping(address => bool) public hasSigned;
    uint256 public totalBricks = 0;

    // Events: a way to emit log statements from smart contract that can be listened to by external parties
    event GreetingChange(address indexed greetingSetter, string newGreeting, bool premium, uint256 value);
    event GuestbookSigned(address indexed signer, uint256 totalBricks);

    // Constructor: Called once on contract deployment
    // Check packages/hardhat/deploy/00_deploy_your_contract.ts
    constructor(address _owner) {
        owner = _owner;
    }

    // Modifier: used to define a set of rules that must be met before or after a function is executed
    // Check the withdraw() function
    modifier isOwner() {
        // msg.sender: predefined variable that represents address of the account that called the current function
        require(msg.sender == owner, "Not the Owner");
        _;
    }

    /**
     * Function that allows users to sign the guestbook
     * Each unique address adds a brick to the wall
     */
    function signGuestbook() public {
        // Check if user has already signed
        require(!hasSigned[msg.sender], "You have already signed the guestbook!");
        
        // Mark as signed and add to builders array
        hasSigned[msg.sender] = true;
        builders.push(msg.sender);
        totalBricks += 1;
        
        // Print to console for debugging
        console.log("New builder signed: %s, Total bricks: %d", msg.sender, totalBricks);
        
        // Emit event
        emit GuestbookSigned(msg.sender, totalBricks);
    }

    /**
     * Function to get the total number of builders (unique signers)
     */
    function getTotalBuilders() public view returns (uint256) {
        return builders.length;
    }

    /**
     * Function to get all builders (addresses that have signed)
     */
    function getAllBuilders() public view returns (address[] memory) {
        return builders;
    }

    /**
     * Function to check if an address has signed the guestbook
     */
    function hasAddressSigned(address _address) public view returns (bool) {
        return hasSigned[_address];
    }

    /**
     * Function that allows anyone to change the state variable "greeting" of the contract and increase the counters
     *
     * @param _newGreeting (string memory) - new greeting to save on the contract
     */
    function setGreeting(string memory _newGreeting) public payable {
        // Print data to the hardhat chain console. Remove when deploying to a live network.
        console.log("Setting new greeting '%s' from %s", _newGreeting, msg.sender);

        // Change state variables
        greeting = _newGreeting;
        totalCounter += 1;
        userGreetingCounter[msg.sender] += 1;

        // msg.value: built-in global variable that represents the amount of ether sent with the transaction
        if (msg.value > 0) {
            premium = true;
        } else {
            premium = false;
        }

        // emit: keyword used to trigger an event
        emit GreetingChange(msg.sender, _newGreeting, msg.value > 0, msg.value);
    }

    /**
     * Function that allows the owner to withdraw all the Ether in the contract
     * The function can only be called by the owner of the contract as defined by the isOwner modifier
     */
    function withdraw() public isOwner {
        (bool success, ) = owner.call{ value: address(this).balance }("");
        require(success, "Failed to send Ether");
    }

    /**
     * Function that allows the contract to receive ETH
     */
    receive() external payable {}
}
