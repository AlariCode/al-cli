import React, { useState, useEffect } from 'react';
import { render, Box, Text, Spacer, useInput } from 'ink';
import Github from './Screens/Github';
import Options from './Screens/Options';
import { ScreenEnum } from './screens.enum';
import useStdoutDimensions from 'ink-use-stdout-dimensions';

const Counter = () => {
	const [screen, SetScreen] = useState<ScreenEnum>(ScreenEnum.Github);
	const [columns, rows] = useStdoutDimensions();

	useInput((input, key) => {
		if (input === '1') {
			SetScreen(ScreenEnum.Github);
		}
		if (input === '0') {
			SetScreen(ScreenEnum.Options);
		}
	});


	return <>
		<Box flexGrow={1} flexDirection="column" height={rows} borderColor="cyan" borderStyle="single">
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
