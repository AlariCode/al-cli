import React, { useState, useEffect } from "react"
import { Text, Newline, useFocusManager, useFocus, useInput, Box, Spacer, useApp} from 'ink';
import GithubToken from './Popups/GithubToken';
import GithubNames from './Popups/GithubNames';
import MenuItem from '../Components/MenuItem';

const Options = () => {
    const { enableFocus, focusNext, focusPrevious, disableFocus } = useFocusManager();
    const [selectedTab, SetSelectedTab] = useState<number>(0);
    const { exit } = useApp();

    useInput((input, key) => {
		if(key.downArrow) {
            focusNext();
        }
        if(key.upArrow) {
            focusPrevious();
        }
	}, { isActive: selectedTab == 0});

    useEffect(() => {
        enableFocus();
        focusNext();
    }, []);


    return <Box flexGrow={1}>
        <Box flexGrow={1} flexDirection="column">
            <Text color="cyan" inverse>Options</Text>
            <Newline />
            <MenuItem label="1. Добавление Github token" onSelect={() =>  SetSelectedTab(1)}/>
            <MenuItem label="2. Добавление имём Github" onSelect={() =>  SetSelectedTab(2)}/>
            <MenuItem label="3. Выход" onSelect={exit}/>
        </Box>
        <Spacer/>
        {selectedTab == 1 && <GithubToken exit={() =>  SetSelectedTab(0)}/> }
        {selectedTab == 2 && <GithubNames exit={() =>  SetSelectedTab(0)}/> }

    </Box>
}

export default Options;