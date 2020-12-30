import React, { useState, useEffect } from "react"
import { Box, useInput, Text, Newline } from 'ink';
import TextInput from 'ink-text-input';
import { ConfigRepository } from '../../Services/config.repository';
import useStdoutDimensions from 'ink-use-stdout-dimensions';

interface GithubTokenProps {
    exit: () => any;
}

const GithubToken = ({ exit }: GithubTokenProps) => {
    const [token, setToken] = useState<string>('');
    const [curreentToken, setCurrentToken] = useState<string>('');
    const [columns, rows] = useStdoutDimensions();

    const loadCurrentToken = async () => {
        const token = await ConfigRepository.loadDBKey<string>('githubToken');
        setCurrentToken(token.data);
    }

    useEffect(() => {
        loadCurrentToken()
    }, []);

    useInput(async (input, key) => {
        if(key.return) {
            await ConfigRepository.updateDBKey<string>('githubToken', token);
            exit();
        }
        if(key.escape) {
            exit();
        }
	});


    return <>
        <Box 
            height={rows - 2}
            width= {40}
            borderColor="cyan"
            borderStyle="round"
            flexDirection="column"
        >
            <Text>Добавление токена github:</Text>
            <Box borderColor="magenta" borderStyle="round">
                <TextInput value={token} onChange={setToken}/>
            </Box>
            <Newline />
            <Text>Текущий добавленный token: {curreentToken}</Text>
        </Box>
    </>
}

export default GithubToken;