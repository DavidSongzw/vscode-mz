import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import axios from 'axios';
interface AssetData {
    uri: vscode.Uri | string;
    title: string;
}


export default class Asset {

    private assetData: AssetData[];
    private page = 1
    private static instance: Asset;

    private constructor(private context: vscode.ExtensionContext) {
        const images = this.getDefaultImages() || [];
        this.assetData = images.map(uri => ({
            uri,
            title: '小哥哥，小哥哥，代码写久了，该休息啦~'
        }))
        this.fetchData()
    }


    public static getInstance(context: vscode.ExtensionContext) {
        if (!Asset.instance) {
        Asset.instance = new Asset(context);
        }
        return Asset.instance;
    }

    private fetchData() {
        axios.get(`https://gank.io/api/v2/data/category/Girl/type/Girl/page/${this.page}/count/50`)
            .then((res : any) => {
                const gankData: any = res.data
                const gankAssetData = (gankData.data || []).map((item: any) => ({
                    uri: item.url,
                    title: '小哥哥，小哥哥，代码写久了，该休息啦~'
                }))
                this.assetData = this.assetData.concat(gankAssetData)
                this.page++
                if (this.page <= gankData.page_count) {
                    this.fetchData()
                }
            });
    }

    public getData(): AssetData {
        const n = Math.floor(Math.random() * this.assetData.length + 1) - 1;
        return this.assetData[n];
    }

    protected getDefaultImages(): vscode.Uri[] {
        const dirPath = this.getDefaultYcyImagePath();
        const files = this.readPathImage(dirPath);
        return files;
    }

    protected readPathImage(dirPath: string): vscode.Uri[] {
        let files: vscode.Uri[] = [];
        const result = fs.readdirSync(dirPath);
        result.forEach(function (item, index) {
            const stat = fs.lstatSync(path.join(dirPath, item));
            if (stat.isFile()) {
                files.push(vscode.Uri.file(path.join(dirPath, item)).with({ scheme: 'vscode-resource' }));
            }
        });
        return files;
    }

    protected getDefaultYcyImagePath() {
        return path.join(this.context.extensionPath, 'images/ycy');
    }
}
