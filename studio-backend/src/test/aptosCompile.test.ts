import { compileAptos } from "../compile"
import * as fs from 'fs';

test("Tests Aptos compile", async () => {
    const code1 = fs.readFileSync("./testPackages/aptosDemo/hello-blockchain/sources/hello_blockchain.move", "utf-8");
    const code2 = fs.readFileSync("./testPackages/aptosDemo/hello-blockchain/sources/hello_blockchain_test.move", "utf-8");
    const project = {
    package: 'hello_blockchain',
    modules: [
        {
            name: 'hello_blockchain',
            code: code1,
        },
        {
            name: 'hello_blockchain_test',
            code: code2,
        },
    ],
    dependencies: [
        {
            name: "hello_blockchain",
            address: "0x0"
        },
    ],
    };
    const byteCode = await compileAptos(project);
    console.log(byteCode)
})