async function hash(type: string, str: string): Promise<ArrayBuffer> {
    return crypto.subtle.digest(type, new TextEncoder().encode(str));
}

function hex(buff: Object): string {
    const hashArray = Array.from(new Uint8Array(buff));
    return hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
}

interface Block {
    index: number,
    timestamp: number,
    previousHash: string,
    data?: string,
    hash: string,
}

interface BlockChain {
    chain: Array<Block>
}

class BlockChain implements BlockChain {
    constructor() {
        this.chain = [this.createGenesisBlock()]
    }

    createGenesisBlock(): Block {
        return new Block(0, Date.now(), "Genesis block", 'here we have info about assets');
    }

    getLastBlock(): Block {
        return this.chain.at(-1);
    }

    addBlockToChain(block: Block): void {
        block.previousHash = this.getLastBlock().hash;
        this.chain = [block, ...this.chain];
    }

    isValid(): boolean {
        let payload: boolean = true;
        for (let i = 1; i < this.chain.length; i++) {
            const current = this.chain[i];
            const prev = this.chain[i-1];
            let currentHash;

            current.calculateHash().then(data => {
                currentHash = hex(data);
            });

            if (current.hash !== currentHash || current.previousHash !== prev.hash) {
                payload = false;
            }
        }

        return payload;
    }
}

class Block implements Block {
    constructor(index: number, timestamp: number, previousHash: string, data?: string) {
        this.index = index;
        this.previousHash = this.previousHash;
        this.timestamp = timestamp;
        this.data = data || '';
        
        this.calculateHash().then(data => this.hash = hex(data))
    }

    calculateHash(): Promise<Object> {
        return hash('SHA-256', `${this.index} ${this.previousHash} ${this.timestamp} ${JSON.stringify(this.data)}`);
    }
}

let DandyCrypto = new BlockChain();
let newBlock: Block = new Block(1,  Date.now(), DandyCrypto.getLastBlock().hash, 'more crypto money I have...');
DandyCrypto.addBlockToChain(newBlock);
console.log(DandyCrypto.isValid());
