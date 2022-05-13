pragma solidity >=0.7.0 <0.9.0;

contract Rent_payment {
    address payable public tenant;      // The account sending payments.
    address payable public landlord;   // The account receiving the payments.
    uint256 public expiration;  // Timeout in case the landlord never closes.
    mapping(address => uint256) balances;
    
    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }
    
    // uint256 landlordBalance = balanceOf(landlord);

    constructor (address payable landlordAddress, uint256 duration) public payable {
        tenant = payable(msg.sender);
        landlord = landlordAddress;
        expiration = block.timestamp + duration;
        
    }

    /// the landlord can close the channel at any time by presenting a
    /// agreed upon amount from the tenant. the landlord will be sent that amount,
    /// and the remainder will go back to the tenant.
    /// This is helpful if the tenant leaves in the middle of a month and the landlord 
    /// agrees to prorate the rent for the month.
    function payRent(uint256 amount) external {
        require(msg.sender == landlord);
        // require(isValidSignature(amount, signature));

        landlord.transfer(amount);
        selfdestruct(tenant);
    }

    /// the tenant can extend the expiration at any time
    /// the landlord can offer the tenant an extension on rent if the tenant cannot pay on time
    /// and provides the landlord with a understandable explanation such as loss of job due to pandemic
    /// for instance NY State allowed tenants to pay their rent many months behind schedule 
    /// without the threat of eviction as a result of the COVID-19 Pandemic.
    function extend(uint256 newExpiration) external {
        require(msg.sender == landlord);
        require(newExpiration > expiration);

        expiration = newExpiration;
    }

    /// if the timeout is reached without the landlord closing the channel,
    /// then the ComputeCoin is released back to the tenant.
    function claimTimeout() external {
        require(block.timestamp >= expiration);
        selfdestruct(tenant);
    }
// landlord doesn't care who pays the rent on behalf of the tenant
    // function isValidSignature(uint256 amount, bytes memory signature)
    //     internal
    //     view
    //     returns (bool)
    // {
    //     bytes32 message = prefixed(keccak256(abi.encodePacked(this, amount)));

    //     // check that the signature is from the tenant
    //     return recoverSigner(message, signature) == tenant;
    // }

    /// All functions below this are just taken from the chapter
    /// 'creating and verifying signatures' chapter.

    // function splitSignature(bytes memory sig)
    //     internal
    //     pure
    //     returns (uint8 v, bytes32 r, bytes32 s)
    // {
    //     require(sig.length == 65);

    //     assembly {
    //         // first 32 bytes, after the length prefix
    //         r := mload(add(sig, 32))
    //         // second 32 bytes
    //         s := mload(add(sig, 64))
    //         // final byte (first byte of the next 32 bytes)
    //         v := byte(0, mload(add(sig, 96)))
    //     }

    //     return (v, r, s);
    // }

    // function recoverSigner(bytes32 message, bytes memory sig)
    //     internal
    //     pure
    //     returns (address)
    // {
    //     (uint8 v, bytes32 r, bytes32 s) = splitSignature(sig);

    //     return ecrecover(message, v, r, s);
    // }

    // /// builds a prefixed hash to mimic the behavior of eth_sign.
    // function prefixed(bytes32 hash) internal pure returns (bytes32) {
    //     return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
    // }
}