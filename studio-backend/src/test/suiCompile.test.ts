import { compile } from "../compile"
import { Project } from '../schema/user-schema'
import * as fs from 'fs';

test("Tests Sui compile", async () => {
    const code = fs.readFileSync("./testPackages/suiDemo/demoPackage/sources/party.move", "utf-8");

    const project = {
    package: 'demoPackage',
    modules: [
        {
            name: 'party',
            code: code,
        },
    ],
    dependencies: [
        {
            name: "demoPackage",
            address: "0x0"
        },
        {
            name: 'Sui',
            address: '0x2',
        },
    ],
    };
    const byteCode = await compile(project);
    console.log(byteCode)
})