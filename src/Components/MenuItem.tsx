import React from "react"
import { Text, useFocus, useInput} from 'ink';

const MenuItem = ({ label, onSelect }: menuItem) => {
    const { isFocused } = useFocus();

    useInput((input, key) => {
		if(key.return) {
            onSelect();
        }
	}, { isActive: isFocused});

    return <Text color="magenta" inverse={isFocused}>{label}</Text>
}

interface menuItem {
    label: string;
    onSelect: () => any
}

export default MenuItem;