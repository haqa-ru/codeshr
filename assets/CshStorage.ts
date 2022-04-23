import { randomBytes } from "crypto";
import { existsSync, mkdirSync } from "fs";
import { readFile, rm, writeFile } from "fs/promises";
import path from "path";

const storagePath = "./cshstorage";

enum Lang {
    "text",
    "python",
    "javascript",
    "text/x-csrc",
    "text/x-c++src",
    "text/x-csharp",
}

interface NoteSchema {
    id: string;
    token: string;
    lang: Lang;
    bigId: boolean;
    date: Date;
    content: string;
}

interface INoteSchema {
    id: string | null;
    token: string;
    lang: Lang;
    bigId: boolean;
    date: Date;
    content: string;
}

interface NoteSaveSchema {
    id: string;
    lang: Lang;
    bigId: boolean;
    date: Date;
    content: string;
}

class CshStorage {
    public constructor() {
        if (!existsSync(storagePath)) {
            mkdirSync(storagePath);
        }
    }

    public async add(data: INoteSchema): Promise<NoteSchema> {
        const id = this.generateId(data.bigId);

        await writeFile(
            path.join(storagePath, id),
            JSON.stringify({ ...data, id: id })
        );

        return { ...data, id: id };
    }

    public async edit(data: NoteSchema): Promise<NoteSchema | undefined> {
        if (!await this.get(data.id)) {
            return undefined;
        }

        await writeFile(path.join(storagePath, data.id), JSON.stringify(data));

        return data;
    }

    public async get(id: string): Promise<NoteSchema | undefined> {
        if (
            !this.validateId(id) ||
            !existsSync(path.join(storagePath, id))
        ) {
            return undefined;
        }

        return JSON.parse(
            (
                await readFile(path.join(storagePath, id))
            ).toString()
        );
    }

    public async del(id: string): Promise<void> {
        if (!await this.get(id)) {
            return;
        }

        await rm(path.join(storagePath, id));
    }

    public safe({token, ...data}: NoteSchema): NoteSaveSchema {
        return data;
    }

    private generateId(isBigId: boolean) {
        let id = randomBytes(isBigId ? 9 : 3).toString("base64url");

        while (existsSync(path.join(storagePath, id))) {
            id = randomBytes(isBigId ? 9 : 3).toString("base64url");
        }

        return id;
    }

    private validateId(id: string): boolean {
        return id && /^[\w-]{4}$/.test(id.toString()) || /^[\w-]{12}$/.test(id.toString());
    }
}

export default () => { return new CshStorage() };
