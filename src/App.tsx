import * as React from 'react';
import {styled, useTheme} from '@mui/material/styles';
import {AppBar, Toolbar, IconButton, Container, Avatar, Box, Typography, SvgIconProps, Tooltip} from '@mui/material';
import {TreeView, TreeItem, TreeItemProps, treeItemClasses} from '@mui/x-tree-view';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionIcon from '@mui/icons-material/Description';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import GithubIcon from '@mui/icons-material/GitHub';
import docs from "./static/docs.json";
import {parseNodes, repoBaseUrl} from './parser';
import './App.css';

const groupEmail = '7last.swe@gmail.com';

declare module 'react' {
    interface CSSProperties {
        '--tree-view-color'?: string;
        '--tree-view-bg-color'?: string;
    }
}

type StyledTreeItemProps = TreeItemProps & {
    bgColor?: string;
    bgColorForDarkMode?: string;
    color?: string;
    colorForDarkMode?: string;
    labelIcon: React.ElementType<SvgIconProps>;
    labelInfo?: string;
    label: React.ReactElement;
    iconColor?: string;
};

const StyledTreeItemRoot = styled(TreeItem)(({theme}) => ({
    color: theme.palette.text.secondary,
    [`& .${treeItemClasses.content}`]: {
        color: theme.palette.text.secondary,
        borderRadius: theme.spacing(2),
        paddingRight: theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium,
        '&.Mui-expanded': {
            fontWeight: theme.typography.fontWeightRegular,
        },
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
        },
        '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
            backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
            color: 'var(--tree-view-color)',
        },
        [`& .${treeItemClasses.label}`]: {
            fontWeight: 'inherit',
            color: 'inherit',
        },
    },
    [`& .${treeItemClasses.group}`]: {
        marginLeft: 0,
        [`& .${treeItemClasses.content}`]: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(1),
        },
    },
})) as unknown as typeof TreeItem;

const StyledTreeItem = React.forwardRef(function StyledTreeItem(
    props: StyledTreeItemProps,
    ref: React.Ref<HTMLLIElement>,
) {
    const theme = useTheme();
    const {
        bgColor,
        color,
        iconColor,
        labelIcon: LabelIcon,
        labelInfo,
        label,
        colorForDarkMode,
        bgColorForDarkMode,
        ...other
    } = props;

    const styleProps = {
        '--tree-view-color': theme.palette.mode !== 'dark' ? color : colorForDarkMode,
        '--tree-view-bg-color':
            theme.palette.mode !== 'dark' ? bgColor : bgColorForDarkMode,
    };

    return (
        <StyledTreeItemRoot
            label={
                <Box sx={{display: 'flex', alignItems: 'center', p: 0.5, pr: 0}}>
                    <Box component={LabelIcon} color={iconColor} sx={{mr: 1, ml: 2}}/>
                    {label}
                    {/*<Typography variant="body2" sx={{fontWeight: 'inherit', flexGrow: 1}}>*/}
                    {/*</Typography>*/}
                    <Typography variant="caption" color="inherit">
                        {labelInfo}
                    </Typography>
                </Box>
            }
            style={styleProps}
            {...other}
            ref={ref}
        />
    );
});

export default function FileTreeView() {

    const rootKey = 'docs';
    let json = JSON.parse(JSON.stringify(docs));// typescript being typescript
    let root = parseNodes(json);

    return (
        <>
            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Avatar alt="7Last" src={require('./static/logo.png')} sx={{mr: 1}}/>
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            sx={{
                                mr: 2,
                                display: {xs: 'none', md: 'flex'},
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            Documentazione 7Last
                        </Typography>

                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            sx={{
                                mr: 2,
                                display: {xs: 'flex', md: 'none'},
                                flexGrow: 1,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            7Last
                        </Typography>
                        <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}></Box>
                        <Tooltip title={'View github repository'}>
                            <IconButton
                                href={repoBaseUrl}
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: '0.5em',
                                    color: 'black',
                                }}>
                                <GithubIcon/>
                            </IconButton>
                        </Tooltip>
                    </Toolbar>
                </Container>
            </AppBar>

            <Box className='container'>
                <TreeView
                    aria-label="file system navigator"
                    defaultCollapseIcon={<ExpandMoreIcon/>}
                    defaultExpandIcon={<ChevronRightIcon/>}
                    defaultExpanded={[rootKey]}
                    // sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
                >
                    {
                        // recursive function that takes a node and returns a tree item
                        function renderTree(node: any) {
                            if ('children' in node) {
                                return (
                                    <StyledTreeItem key={node.name}
                                                    nodeId={node.name}
                                                    labelIcon={FolderIcon}
                                                    label={
                                                        <Typography variant="body2"
                                                                    sx={{fontWeight: 'inherit', flexGrow: 1}}>
                                                            {node.name}
                                                        </Typography>}
                                                    iconColor={'#eda41e'}>
                                        {node.children
                                            // .sort((a: any, b: any) => a.name.localeCompare(b.name))
                                            .map(renderTree)}
                                    </StyledTreeItem>
                                );
                            } else {
                                return (
                                    <StyledTreeItem key={node.name}
                                                    nodeId={node.name}
                                                    label={<a href={node.url} target="_blank" rel="noreferrer">
                                                        {node.name + ' - ' + node.size}
                                                    </a>}
                                                    labelIcon={DescriptionIcon}
                                    />
                                );
                            }
                        }(root)
                    }
                </TreeView>
            </Box>
            <footer>
                <Typography align="center" sx={{
                    fontFamily: 'monospace'
                }}>
                    <a href={`mailto:${groupEmail}`}>{groupEmail}</a>
                </Typography>
            </footer>
        </>
    );
}
// export default App;
