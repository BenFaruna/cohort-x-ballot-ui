import { Box, Button, Card, Flex, Text, TextField } from "@radix-ui/themes";
import { useState } from "react";
import useDelegateVote from "../hooks/useDelegateVote";

const DelegateVote = () => {
    const [address, setAddress] = useState("");

    const handleDelegate = useDelegateVote(address);
    return (
        <Card size="2" style={{ width: 425 }}>
            <Flex gap="" align="center">
                <Box width={"100%"}>
                    <Flex direction="column" gap="3">
                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">
                                Delegate&apos;s Address
                            </Text>
                            <TextField.Input
                                placeholder="Enter Delegate's Address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </label>
                        <Button onClick={async () => {
                            await handleDelegate()
                            setAddress("")
                        }}>
                            Delegate vote
                        </Button>
                    </Flex>
                </Box>
            </Flex>
        </Card>
    );
};

export default DelegateVote;
