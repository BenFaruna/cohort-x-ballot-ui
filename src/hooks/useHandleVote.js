import { useCallback } from "react";

import toast from "react-hot-toast";

import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { isSupportedChain } from "../utils";
import { getProvider } from "../constants/providers";
import { getProposalsContract } from "../constants/contracts";


const useHandleVote = () => {
    const { chainId } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();

    return useCallback(async (id) => {
        if (!isSupportedChain(chainId)) return console.error("Wrong network");
        const readWriteProvider = getProvider(walletProvider);
        const signer = await readWriteProvider.getSigner();

        const contract = getProposalsContract(signer);

        try {
            const transaction = await contract.vote(id);
            console.log("transaction: ", transaction);
            const receipt = await transaction.wait();

            console.log("receipt: ", receipt);

            if (receipt.status) {
                toast.success("Vote successfull!");
                return console.log("vote successfull!");
            }
            toast.error("Vote failed!");
            console.log("vote failed!");
        } catch (error) {
            console.log(error);
            let errorText;
            if (error.reason === "Has no right to vote") {
                errorText = "You have no right to vote";
            } else if (error.reason === "Already voted.") {
                errorText = "You have already voted";
            } else {
                errorText = "An unknown error occured";
            }

            toast.error(errorText);
            console.error("error: ", errorText);
        }
    }, [chainId, walletProvider])
}

export default useHandleVote