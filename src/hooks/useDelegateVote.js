import { useCallback } from "react";
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
        if (!isSupportedChain(chainId)) return console.error("Wrong network");
        if (!isAddress(address)) return console.error("Invalid address");
        const readWriteProvider = getProvider(walletProvider);
        const signer = await readWriteProvider.getSigner();

        const contract = getProposalsContract(signer);

        try {
            const tx = await contract.delegate(address);
            const receipt = await tx.wait();

            if (receipt.status) {
                return console.log("delegate successfull!");
            }
            console.log("delegate failed!");
        } catch (error) {
            console.error("error: ", error);
        }
    }, [address, chainId, walletProvider]);
}

export default useDelegateVote