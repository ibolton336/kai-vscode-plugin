import { EventEmitter, TreeItemCollapsibleState } from 'vscode';
import { AbstractNode, ITreeNode } from './abstractNode';
import { DataProvider } from './dataProvider';
import { RhamtConfiguration } from '../model/model';
import { ModelService } from '../model/modelService';
import { ConfigurationNode } from './configurationNode';
import { ClassificationsItem } from './classificationsItem';
import * as path from 'path';

export class ClassificationsNode extends AbstractNode<ClassificationsItem> {

    private loading: boolean = false;

    file: string;
    private children = [];

    constructor(
        config: RhamtConfiguration,
        file: string,
        modelService: ModelService,
        onNodeCreateEmitter: EventEmitter<ITreeNode>,
        dataProvider: DataProvider,
        root: ConfigurationNode) {
        super(config, modelService, onNodeCreateEmitter, dataProvider);
        this.file = file;
        this.root = root;
        this.treeItem = this.createItem();
        this.listen();
    }

    createItem(): ClassificationsItem {
        return new ClassificationsItem(this.file);
    }

    delete(): Promise<void> {
        return Promise.resolve();
    }

    public getChildren(): Promise<ITreeNode[]> {
        if (this.loading) {
            return Promise.resolve([]);
        }
        return Promise.resolve(this.children);
    }

    public hasMoreChildren(): boolean {
        return this.children.length > 0;
    }

    private listen(): void {
        this.loading = true;
        this.treeItem.iconPath = {
            light: path.join(__dirname, '..', '..', '..', 'resources', 'light', 'Loading.svg'),
            dark: path.join(__dirname, '..', '..', '..', 'resources', 'dark', 'Loading.svg')
        };
        this.treeItem.collapsibleState = TreeItemCollapsibleState.None;
        setTimeout(() => {
            this.treeItem.iconPath = undefined;
            this.loading = false;
            this.refresh(this);
        }, 1000);
    }

    protected refresh(node?: ITreeNode): void {
        this.children = this.root.getChildNodes(this);
        this.treeItem.refresh();
        super.refresh(node);
    }
}