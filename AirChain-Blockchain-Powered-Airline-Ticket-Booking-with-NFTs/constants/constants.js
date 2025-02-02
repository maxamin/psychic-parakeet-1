import Airline from './Airline.json';

export const ABI = Airline.abi;
export const ContractAddress = '0xAC9FFEE169c1646A4220135Ef7D01f20459d6227'

const SIGNING_DOMAIN_NAME = "AirlineTickets";
const SIGNING_DOMAIN_VERSION = "1";
const chainId = 80001;

export const voucher = {
  "api": "abcabc",
  "signature": "0xfd20ee01ae1fa9a19184615650947208b36e08abb2f484d6b01eea10db25f58410394369538860c34ecffdd1acaea5bef3735247a27509390ce4b8132c3af1ef1c"
}
export const domain = {
  name: SIGNING_DOMAIN_NAME,
  version: SIGNING_DOMAIN_VERSION,
  verifyingContract: ContractAddress,
  chainId,
};
