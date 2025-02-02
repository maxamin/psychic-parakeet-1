// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import {AccessControlEnumerable} from "openzeppelin-contracts/access/AccessControlEnumerable.sol";

/**
 * @title TrustfulOracle
 * @author Damn Vulnerable DeFi (https://damnvulnerabledefi.xyz)
 * @notice A price oracle with a number of trusted sources that individually report prices for symbols.
 *         The oracle's price for a given symbol is the median price of the symbol over all sources.
 */
contract TrustfulOracle is AccessControlEnumerable {
    bytes32 public constant TRUSTED_SOURCE_ROLE =
        keccak256("TRUSTED_SOURCE_ROLE");

    bytes32 public constant INITIALIZER_ROLE = 
        keccak256("INITIALIZER_ROLE");

    // Source address => (symbol => price)
    mapping(address => mapping(string => uint256)) private pricesBySource;

    event UpdatedPrice(
        address indexed source,
        string indexed symbol,
        uint256 oldPrice,
        uint256 newPrice
    );

    error NotATrustedSource();
    error NotInitializer();
    error EmptyArray();
    error ArraysWithDifferentSizes();

    modifier onlyTrustedSource() {
        if (!hasRole(TRUSTED_SOURCE_ROLE, msg.sender))
            revert NotATrustedSource();
        _;
    }

    modifier onlyInitializer() {
        if (!hasRole(INITIALIZER_ROLE, msg.sender)) revert NotInitializer();
        _;
    }

    constructor(address[] memory sources, bool enableInitialization) {
        if (sources.length == 0) revert EmptyArray();
        for (uint256 i = 0; i < sources.length; i++) {
            _setupRole(TRUSTED_SOURCE_ROLE, sources[i]);
        }

        if (enableInitialization) {
            _setupRole(INITIALIZER_ROLE, msg.sender);
        }
    }

    // A handy utility allowing the deployer to setup initial prices (only once)
    function setupInitialPrices(
        address[] memory sources,
        string[] memory symbols,
        uint256[] memory prices
    ) public onlyInitializer {
        // Only allow one (symbol, price) per source
        if (
            !(sources.length == symbols.length &&
                symbols.length == prices.length)
        ) revert ArraysWithDifferentSizes();

        for (uint256 i = 0; i < sources.length; i++) {
            _setPrice(sources[i], symbols[i], prices[i]);
        }
        renounceRole(INITIALIZER_ROLE, msg.sender); // 执行完上操作之后就剥夺合约部署者的初始权限
    }

    // 预言机的价格更新也是由可信reporter address从外部对postPrice进行调用完成的
    // 该函数不断被调用,价格不断被更新,预言机就能够不断向外界提供最新的价格
    // 但是好像没看到跟时间相关的条件
    // 而且是仅仅根据symbol进行的,没有对NFT合约地址进行鉴定
    // 但由于reporter address我们不能控制,因此即使没有上面的限制也无所谓
    function postPrice(string calldata symbol, uint256 newPrice)
        external
        onlyTrustedSource
    {
        _setPrice(msg.sender, symbol, newPrice);
    }

    function getMedianPrice(string calldata symbol)
        external
        view
        returns (uint256)
    {
        return _computeMedianPrice(symbol);
    }

    function getAllPricesForSymbol(string memory symbol)
        public
        view
        returns (uint256[] memory)
    {
        uint256 numberOfSources = getNumberOfSources();
        uint256[] memory prices = new uint256[](numberOfSources);

        for (uint256 i = 0; i < numberOfSources; i++) {
            address source = getRoleMember(TRUSTED_SOURCE_ROLE, i);
            prices[i] = getPriceBySource(symbol, source);
        }

        return prices;
    }

    function getPriceBySource(string memory symbol, address source)
        public
        view
        returns (uint256)
    {
        return pricesBySource[source][symbol];
    }

    function getNumberOfSources() public view returns (uint256) {
        return getRoleMemberCount(TRUSTED_SOURCE_ROLE);
    }

    function _setPrice(
        address source,
        string memory symbol,
        uint256 newPrice
    ) private {
        uint256 oldPrice = pricesBySource[source][symbol];
        pricesBySource[source][symbol] = newPrice;
        emit UpdatedPrice(source, symbol, oldPrice, newPrice);
    }

    function _computeMedianPrice(string memory symbol)
        private
        view
        returns (uint256)
    {
        uint256[] memory prices = _sort(getAllPricesForSymbol(symbol));

        // calculate median price
        if (prices.length % 2 == 0) {
            uint256 leftPrice = prices[(prices.length / 2) - 1];
            uint256 rightPrice = prices[prices.length / 2];
            return (leftPrice + rightPrice) / 2;
        } else {
            return prices[prices.length / 2];
        }
    }

    function _sort(uint256[] memory arrayOfNumbers)
        private
        pure
        returns (uint256[] memory)
    {
        for (uint256 i = 0; i < arrayOfNumbers.length; i++) {
            for (uint256 j = i + 1; j < arrayOfNumbers.length; j++) {
                if (arrayOfNumbers[i] > arrayOfNumbers[j]) {
                    uint256 tmp = arrayOfNumbers[i];
                    arrayOfNumbers[i] = arrayOfNumbers[j];
                    arrayOfNumbers[j] = tmp;
                }
            }
        }
        return arrayOfNumbers;
    }
}
