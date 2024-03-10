import { useCallback } from "react";
import { isSupportedChain } from "../utils";
import { isAddress } from "ethers";
import { getProvider } from "../constants/providers";
import { getProposalsContract } from "../constants/contracts";
import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import toast from "react-hot-toast";


const useGiveRightToVote = (address) => {
    const { chainId } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();

    return useCallback(async () => {
        if (!isSupportedChain(chainId)) {
            toast.error("Wrong network")
            return console.error("Wrong network")
        };
        if (!isAddress(address)) {
            toast.error("Invalid Address")
            return console.error("Invalid address")
        };
        const readWriteProvider = getProvider(walletProvider);
        const signer = await readWriteProvider.getSigner();

        const contract = getProposalsContract(signer);

        try {
            const estimatedGas = await contract.giveRightToVote.estimateGas(
                address
            );
            // console.log("estimatedGas: ", estimatedGas);

            // const feeData = await readWriteProvider.getFeeData();

            // console.log("feeData: ", feeData);

            // const gasFee = estimatedGas * feeData.gasPrice;

            // console.log("estimated: ", gasFee);

            const transaction = await contract.giveRightToVote(address, {
                gasLimit: estimatedGas,
            });
            console.log("transaction: ", transaction);
            const receipt = await transaction.wait();

            console.log("receipt: ", receipt);

            if (receipt.status) {
                toast.success("Voter added")
                return console.log("giveRightToVote successfull!");
            }
            toast.error("Voter added")
            console.log("giveRightToVote failed!");
        } catch (error) {
            toast.error(error.reason)
            console.error("error: ", error);
        }
    }, [address, chainId, walletProvider]);
};

export default useGiveRightToVote;
