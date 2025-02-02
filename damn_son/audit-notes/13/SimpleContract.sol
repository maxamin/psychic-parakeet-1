pragma solidity ^0.4.24;
contract SimpleContract {
    address origin = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;
    bytes8 key = bytes8(origin);
    bytes8 mask = 0xFFFFFFFF0000FFFF;
    bytes8 res = key & mask;
    /*
        uint64 = 64/8 = 8 bytes
        1 byte = 2 length in hex
        8 bytes = 16 length in hex => uint64 = 16 length in hex
        uint32 = 8 length in hex
        require uint32 == uint16 => 4 on right hand side need to be the same
        if we pass 0xFFFFFFFFFFFFFFFF it will evaluate to
        0x00000000FFFFFFFF == 0x000000000000FFFF which is not true, therefore we have to somehow get to 0x000000000000FFFF 
        in order to reach this, we first let the operations do its thing so it becomes 0x00000000FFFFFFFF
        then we need to make the first 4 F's into 0's, the way we can achieve this is by applying a mask of 0's:
        og:   0x00000000 FFFF FFFF
        mask: 0x00000000 0000 FFFF
        ----------------------------
        res:  0x00000000 0000 FFFF
    */
    function evaluateFirst()public view returns (bool){
        if(uint32(res) == uint16(res)){
            return true;
        }
        else{
            return false;
        }
    }
    /*
        requires 16 length not equal to 8 length i.e.
        0xFFFFFFFFFFFFFFFF != 0x00000000FFFFFFFF => 8 on left hand side must not be the same
        since they will always be compared to 8 0's, we will have to populate them with not 8 0's.
        the first also still needs to be true so we have to work with the previous mask and expand it
        Mask from 1st: 0x00000000 0000 FFFF

        Now we need to make this mask also turn the first 8's into F's, so it has to become:
        0xFFFFFFFF 0000 FFFF
    */
    function eveluateSecond()public view returns(bool){
        if(uint32(res) != uint64(res)){
            return true;
        }
        else{
            return false;
        }
    }

    /*
        requires uint32 == uint16(tx.origin)
        uint32 = 0x00000000FFFFFFFF
        uint16 = 0x000000000000FFFF
        tx.origin = address of 40 hex length
        uint16 is of length 4 in hex so uint16(tx.origin) is that last 4 hex chars
        so we need to turn
        0x00000000FFFFFFFF
        into
        0x000000000000FFFF
        let's apply the mask first and see what happens
        og:   0x00000000FFFFFFFF
        mask: 0xFFFFFFFF0000FFFF
        -------------------------
        res:  0xFFFFFFFF0000FFFF

        now, let's turn this into uint32 and uint16
        uint32: 0x00000000 0000FFFF
        uint16: 0x00000000 0000 FFFF

        so the mask does not have to be changed! - all we have to pass as a key is the tx.origin
    */
    function evaluateThird()public view returns (bool){
        if(uint32(res) == uint16(tx.origin)){
            return true;
        }
        else{
            return false;
        }
    }
}