import React, { useState, useEffect } from "react"
import { Box, useInput, Text, Newline } from 'ink';
import TextInput from 'ink-text-input';
import { ConfigRepository } from '../../Services/config.repository';
import useStdoutDimensions from 'ink-use-stdout-dimensions';

interface GithubNamesProps {
    exit: () => any;
}

const GithubNames = ({ exit }: GithubNamesProps) => {
    const [names, setNames] = useState<string>('');
    const [currentNames, setCurrentNames] = useState<string>('');
    const [columns, rows] = useStdoutDimensions();

    const loadCurrentNames = async () => {
        const names = await ConfigRepository.loadDBKey<string>('githubNames');
        setCurrentNames(names.data);
    }

    useEffect(() => {
        loadCurrentNames()
    }, []);

    useInput(async (input, key) => {
        if(key.return) {
            await ConfigRepository.updateDBKey<string>('githubNames', names);
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
            <Text>Добавление имён для сканирования github через пробел:</Text>
            <Box borderColor="magenta" borderStyle="round">
                <TextInput value={names} onChange={setNames}/>
            </Box>
            <Newline />
            <Text>Текущие имена: {currentNames}</Text>
        </Box>
    </>
}

export default GithubNames;