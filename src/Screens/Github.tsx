import React, { useEffect, useState } from "react"
import { Box, Newline, Spacer, Text, useFocusManager, useInput } from 'ink';
import { GitHubService } from "../Services/github.service";
import MenuItem from '../Components/MenuItem';
import Table from 'ink-table'
import { ConfigRepository } from "../Services/config.repository";
import useStdoutDimensions from 'ink-use-stdout-dimensions';

const PER_PAGE = 10;

interface ITable {
    id: number;
    name: string;
    url: string;
    status: string
}

const Github = () => {
    const { enableFocus, focusNext, focusPrevious, disableFocus } = useFocusManager();
    const [error, SetError] = useState<string | undefined>(undefined);
    const [names, SetName] = useState<string[]>([]);
    const [selecedName, SetSelectedName] = useState<string>();
    const [table, setTable] = useState<ITable[]>([]);
    const [perPage, SetPerPage] = useState<number>(PER_PAGE);
    const [offset, SetOffset] = useState<number>(0);
    const [isLoading, SetIsLoading] = useState<boolean>(false);
    const [columns, rows] = useStdoutDimensions();

    useEffect(() => {
        loadNames();
    }, [])

    useEffect(() => {
        SetPerPage(rows / 5)
    }, [rows])

    const loadJobs = async (repositories: any) => {
        if (!repositories) {
            return;
        }
        for (const r of repositories) {
            if (!r.owner) {
                continue;
            }
            const workflow = await GitHubService.getPipelineStatus(r.owner?.login, r.name);
            if (workflow.data.workflow_runs.length > 0) {
                setTable(rows => [...updateRow(rows, {
                    id: r.id,
                    name: r.name,
                    url: r.html_url,
                    status: workflow.data.workflow_runs[0].status
                })])
            }
        }
        SetIsLoading(false);
    };

    const updateRow = (rows: ITable[], newEl: ITable): ITable[] => {
        const toUpdate = rows.find(r => r.id === newEl.id);
        if (toUpdate) {
            return rows.map(r => {
                if (r.id === newEl.id) {
                    return newEl;
                }
                return r;
            })
        }
        return [...rows, newEl];
    };

    const loadRepos = async (name: string) => {
        try {
            SetSelectedName(name)
            SetIsLoading(true);
            const repos = await GitHubService.loadRepos(name);
            setTable([]);
            await loadJobs(repos);
        } catch (e) {
            SetError(e.message)
        }
    };

    const loadNames = async () => {
        const names = await ConfigRepository.loadDBKey<string>('githubNames');
        SetName(names.data.split(' '));
        enableFocus();
        focusNext();
    }

    useInput((input, key) => {
        if(key.downArrow) {
            focusNext();
        }
        if(key.upArrow) {
            focusPrevious();
        }
        if (key.rightArrow) {
            if (table && offset + perPage >= table?.length) {
                return;
            }
            SetOffset(x => x + perPage);
        }
        if (key.leftArrow) {
            if (offset - perPage < 0) {
                return;
            }
            SetOffset(x => x - perPage);
        }
        if (input == 'r' || input == 'R') {
            loadRepos(selecedName ?? '');
        }
    });

    return <>
        <Text color="cyan" inverse>Github</Text>
        <Newline />
        <Box flexDirection="row">
            <Box marginRight={2} flexDirection="column">{names.length > 0 && names.map(n => 
            <MenuItem key="n" label={n} onSelect={() => loadRepos(n)}/>)}</Box>
            <Box flexDirection="column">
                {isLoading && <Text color="green">Идёт загрузка...</Text>}
                {table && table.length > 0 && <Table data={table.slice(offset, offset + perPage).map(x => {
                    return {
                        name: x.name,
                        url: x.url,
                        status: x.status
                    }
                }) as any} />}
                <Text>Page {Math.floor((offset + perPage)/ perPage)}/{Math.ceil(table.length / perPage)}</Text>
                <Box flexGrow={1} flexDirection="row">
                    <Box marginRight={2}><Text inverse>{' <- Page left '}</Text></Box>
                    <Box marginRight={2}><Text inverse>{' R - to update '}</Text></Box>
                    <Box marginRight={2}><Text inverse>{' Page right -> '}</Text></Box>
                </Box>
                {error && <Text color="red" inverse>{error}</Text>}
            </Box>
        </Box>
    </>
}

export default Github;