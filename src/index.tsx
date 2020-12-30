import React, { useState, useEffect } from 'react';
import { render, Box, Text, Spacer, useInput } from 'ink';
import window from 'window-size';
import Github from './Screens/Github';
import Options from './Screens/Options';
import { ScreenEnum } from './screens.enum';

const Counter = () => {
	const [termHeight, SetTermHeight] = useState<number>(0);
	const [screen, SetScreen] = useState<ScreenEnum>(ScreenEnum.Github);

	useInput((input, key) => {
		if (input === '1') {
			SetScreen(ScreenEnum.Github);
		}
		if (input === '0') {
			SetScreen(ScreenEnum.Options);
		}
	});

	useEffect(() => {
		SetTermHeight(window.height);
	});

	return <>
		<Box flexGrow={1} flexDirection="column" height={termHeight} borderColor="cyan" borderStyle="single">
			{screen === ScreenEnum.Github && <Github/>}
			{screen === ScreenEnum.Options && <Options/>}
			<Spacer/>
			<Box>
				<Text>[1]: Github   </Text>
				<Text>[0]: Options   </Text>
				<Text>[Ctrl + C]: Exit   </Text>
			</Box>
		</Box>
	</>;
};

render(<Counter />);
