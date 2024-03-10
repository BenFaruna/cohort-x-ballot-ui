import { useCallback } from "react";
import toast from "react-hot-toast";
import { isSupportedChain } from "../utils";
import { isAddress } from "ethers";
import { getProvider } from "../constants/providers";
import { getProposalsContract } from "../constants/contracts";
import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react";

const useDelegateVote = (address) => {
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
            const tx = await contract.delegate(address);
            const receipt = await tx.wait();

            if (receipt.status) {
                toast.success("Delegate successfull!");
                return console.log("delegate successfull!");
            }
            toast.error("Delegate failed!");
            console.log("delegate failed!");
        } catch (error) {
            console.error(error);
            let errorText;
            if (error.reason === "You already voted.") {
                errorText = "You already voted.";
            } else if (error.reason === "Self-delegation is disallowed.") {
                errorText = "Self-delegation is disallowed.";
            } else if (error.reason === "Found loop in delegation.") {
                errorText = "Found loop in delegation.";
            } else {
                errorText = "An unknown error occured";
            }

            toast.error(errorText);
            console.error("error: ", errorText);
        }
    }, [address, chainId, walletProvider]);
}

export default useDelegateVote